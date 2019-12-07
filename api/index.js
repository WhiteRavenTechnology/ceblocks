const util = require('util');
const dcsdk = require('dragonchain-sdk');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const helper = require('./ceblocks-helper');

const app = express();

const main = async() => {
	const awaitHandlerFactory = (middleware) => {
		return async (req, res, next) => {
			try {
				await middleware(req, res, next)
			} catch (err) {
				next(err)
			}
		}
	}

	app.use(helmet());

	app.use(cors());

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }))

	// Basic authentication middleware //
	app.use(async function (req, res, next) {

        // check for basic auth header
		if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
			return res.status(401).json({ message: 'Missing Authorization Header' });
		}
	
		// verify auth credentials
		const base64Credentials =  req.headers.authorization.split(' ')[1];
		const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
		const [username, apiKey] = credentials.split(':');
        
        const client = await dcsdk.createClient();

        const apiKeyMap = await helper.getAPIKeyMapObject(client);
        
        if (typeof apiKeyMap[username] === "undefined" || apiKeyMap[username] != apiKey)
		    return res.status(401).json({ message: 'Invalid Authentication Credentials' });	
		next();
	})
	
	// Get all providers //
	app.get('/providers', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();
		
		const providers = await helper.getProviders(client);

		const providerObjects = await Promise.all(providers.map(async p => {return await helper.getEntityObject(client, {entityId: p.id})}));

        res.json(providerObjects);
	}));	

	// Get a specific provider //
	app.get('/providers/:providerId', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

		const provider = await helper.getEntityObject(client, {entityId: req.params.providerId});

		res.json(provider);
	}));	


	// Create a new provider //
	app.post('/providers', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

		let provider = req.body.provider;

		const requestTxn = await helper.createProvider(client, {provider: provider});

		res.json(requestTxn);
    }));


    // Get all participants //
	app.get('/participants', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();
		
		const participants = await helper.getParticipants(client);

		const participantObjects = await Promise.all(participants.map(async p => {return await helper.getEntityObject(client, {entityId: p.id})}));

        res.json(participantObjects);
    }));	
    
    // Get a specific participant by providerId and encrypted customer identifier //
	app.get('/participants/:providerId/:encryptedCustomerIdentifier', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

        try {
            const participantTransactionRecord = await helper.findParticipantByIdentifier(client, {providerId: req.params.providerId, encryptedCustomerIdentifier: req.params.encryptedCustomerIdentifier});
            
            const participant = await helper.getEntityObject(client, {entityId: participantTransactionRecord.id})

            res.json(participant);

        } catch (exception) {
            throw "Participant not found.";
        }        		
	}));
    
    // Get a specific participant //
	app.get('/participants/:participantId', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

		const participant = await helper.getEntityObject(client, {entityId: req.params.participantId});

		res.json(participant);
	}));	


	// Create a new participant //
	app.post('/participants', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

        let participant = req.body.participant;
        
        // Make sure provider doesn't already have a participant with this encrypted identifier //


		const requestTxn = await helper.createParticipant(client, {participant: participant});

		res.json(requestTxn);
	}));


    // Get all credit records //
	app.get('/credit-records', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();
		
		const creditRecords = await helper.getCreditRecords(client);

		const creditRecordObjects = await Promise.all(creditRecords.map(async c => {return await helper.getCreditRecordObject(client, {creditRecordId: c.id})}));

        res.json(creditRecordObjects);
    }));	

    // Get a specific credit record //
	app.get('/credit-records/:creditRecordId', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

		const creditRecord = await helper.getCreditRecordObject(client, {creditRecordId: req.params.creditRecordId});

		res.json(creditRecord);
	}));

    // Create a credit record by encrypted customer identifier //
    app.post('/credit-records/by-customer-identifier', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

        let creditRecord = req.body.creditRecord;
        
        const provider = await helper.getEntityObject(client, {entityId: creditRecord.providerId});

        // Look up participant ID if available //
        let participantId = null;

        try {
            participantTransactionRecord = await helper.findParticipantByIdentifier(client, {providerId: creditRecord.providerId, encryptedCustomerIdentifier: creditRecord.encryptedCustomerIdentifier});

            participantId = participantTransactionRecord.id;

        } catch (exception)
        {
            const newParticipantRequestTxn = await helper.createParticipant(client, {
                participant: {
                    "providerId": creditRecord.providerId,
                    "encryptedCustomerIdentifier": creditRecord.encryptedCustomerIdentifier
                }
            });

            participantId = newParticipantRequestTxn.response.transaction_id;

            await helper.sleep(6000); // Make sure we wait for the block to be written before continuing //
        }

        creditRecord.participantId = participantId;

        // Transfer the points //
        const points = creditRecord.eventCredits * provider.creditToPointsMultiplier;

        const ptRequestTxn = await helper.transferPoints(client, {            
            pointTransfer: {
                "fromEntityId": creditRecord.providerId, 
                "toEntityId": creditRecord.participantId, 
                "points": points
            }
        });

        creditRecord.pointTransfer = {
            "id": ptRequestTxn.response.transaction_id,
            "pointsAwarded": points
        };

        // Create the credit record //
		const requestTxn = await helper.createCreditRecord(client, {creditRecord: creditRecord, callbackURL: provider.addCreditRecordCallbackURL});

        
		res.json(requestTxn);
	}));

	// Create a credit record //
    app.post('/credit-records/', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

        let creditRecord = req.body.creditRecord;
        
        const provider = await helper.getEntityObject(client, {entityId: creditRecord.providerId});

        const participant = await helper.getEntityObject(client, {entityId: creditRecord.participantId});

        creditRecord.encryptedCustomerIdentifier = participant.encryptedCustomerIdentifier;

        // Transfer the points //
        const points = creditRecord.eventCredits * provider.creditToPointsMultiplier;

        const ptRequestTxn = await helper.transferPoints(client, {            
            pointTransfer: {
                "fromEntityId": creditRecord.providerId, 
                "toEntityId": creditRecord.participantId, 
                "points": points
            }
        });

        creditRecord.pointTransfer = {
            "id": ptRequestTxn.response.transaction_id,
            "pointsAwarded": points
        };

        // Create the credit record //
		const requestTxn = await helper.createCreditRecord(client, {creditRecord: creditRecord, callbackURL: provider.addCreditRecordCallbackURL});

		res.json(requestTxn);
    }));

    
    // REDEEM points (provider-controlled, burns points for participant) //
	app.post('/redeem-points', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

        // Make sure provider owns participant record //
        const participant = await helper.getEntityObject(client, {entityId: req.body.participantId});

        if (participant.providerId != req.body.providerId)
            throw "Invalid participant specified for redemption.";

        if (req.body.points > participant.points)        
            throw "The participant has an insufficient balance to redeem the specified amount.";
        
		const requestTxn = await helper.transferPoints(client, {            
            pointTransfer: {
                "fromEntityId": req.body.participantId,
                "toEntityId": null, 
                "points": req.body.points
            }
        });

		res.json(requestTxn);
	}));
    

    // Get an object's Dragon Net verifications //
	app.get('/verifications/:objectId', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

		const verifications = await helper.getBlockVerificationsForTxnId(client, {objectId: req.params.objectId});

		res.json(verifications);
	}));

	// Error handling //
	app.use(function (err, req, res, next) {
		console.error(err);

		res.status(400).json({ message: err });
	});

	// In production (optionally) use port 80 or, if SSL available, use port 443 //
	const server = app.listen(3030, () => {
		console.log(`Express running → PORT ${server.address().port}`);
	});
}


main().then().catch(console.error)


