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


