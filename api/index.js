const util = require('util');
const dcsdk = require('dragonchain-sdk');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const helper = require('./asset-tracker-api-helper');

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

	// Basic authentication middleware (obviously not the way to handle things in a production system...) //
	app.use(function (req, res, next) {
			
		// check for basic auth header
		if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
			return res.status(401).json({ message: 'Missing Authorization Header' });
		}
	
		// verify auth credentials
		const base64Credentials =  req.headers.authorization.split(' ')[1];
		const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
		const [username, password] = credentials.split(':');
		
		// Seriously. Don't use this in a production system. //
		const authenticatedCustodianId = (password == "mypassword") ? username : undefined;

		if (typeof authenticatedCustodianId === "undefined") 
			return res.status(401).json({ message: 'Invalid Authentication Credentials' });		
	
		// attach user to request object
		req.authenticatedCustodianId = authenticatedCustodianId
		
		next();
	})
	
	// Get all providers //
	app.get('/providers', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

		const authenticatedCustodian = await helper.getCurrentCustodianObject(client, {custodianId: req.authenticatedCustodianId});

		if (authenticatedCustodian.type != "authority")
			throw "Only the authority custodian may do that.";

		const custodians = await helper.getCustodians(client);

		// This is a potentially dangerously long-running .map if there are many custodians (but a useful demonstration) //
		// Note: I hear a rumor we may get an SDK method that'll pull a list of objects rather than one at a time //
		// Full Disclosure: I just asked if they'd add it... Seriously: jump into Slack. DC devs are super nice dudes. //
		const custodianObjects = await Promise.all(custodians.map(async c => {return await helper.getCurrentCustodianObject(client, {custodianId: c.id})}));

		res.json(custodianObjects);
	}));	

	// Get a specific custodian //
	app.get('/custodians/:custodianId', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

		const authenticatedCustodian = await helper.getCurrentCustodianObject(client, {custodianId: req.authenticatedCustodianId});

		if (authenticatedCustodian.type != "authority" && authenticatedCustodian.id != custodianId)
			throw "Only the authority or the custodian may do that.";

		const custodian = await helper.getCurrentCustodianObject(client, {custodianId: req.params.custodianId});

		res.json(custodian);
	}));	


	// Create a new custodian //
	app.post('/custodians', awaitHandlerFactory(async (req, res) => {
		const client = await dcsdk.createClient();

		const authenticatedCustodian = await helper.getCurrentCustodianObject(client, {custodianId: req.authenticatedCustodianId});

		if (authenticatedCustodian.type != "authority")
			throw "Only the authority custodian may do that.";

		let custodian = {			
			"type": req.body.custodian.type
		};

		if (req.body.custodian.external_data)
		{
			custodian.external_data = req.body.custodian.external_data
		}

		const requestTxn = await helper.createCustodian(client, {custodian: custodian, authenticatedCustodian: authenticatedCustodian});

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


