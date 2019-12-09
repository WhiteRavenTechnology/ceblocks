const express = require('express');
const exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
const rp = require('request-promise');
const cryptojs = require('crypto-js');

const app = express();
app.use(cookieParser());

// Utility
const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

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
	
	let config = require('./config.json');

	config.auth = Buffer.from(`${config.apiId}:${config.apiKey}`).toString("base64");
    
    var hbs = exphbs.create({
		helpers: {
			json: function (context) {return JSON.stringify(context);},
			list: function(context, options) {
				var ret = "";
			  
				for (var i = 0, j = context.length; i < j; i++) {
				  ret = ret + options.fn(context[i]);
				}
			  
				return ret;
			}
		}
	});

	app.engine('handlebars', hbs.engine);
	app.set('view engine', 'handlebars');

	app.use(express.urlencoded({ extended: true }))
	app.use('/public',  express.static(__dirname + '/public'));		
	app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

	app.get('/', awaitHandlerFactory(async (req, res) => {
		res.render('index', {title: "CEBlocks", layout: "simple.handlebars"});
	}));

	app.get('/AddProvider', awaitHandlerFactory(async (req, res) => {
		res.render('addprovider', {title: "Add a CEBlocks Provider"});
	}));

	app.post('/AddProvider', awaitHandlerFactory(async (req, res) => {
		
		let industries = req.body.industries.join(",");

		const options = {
			method: 'POST',
			uri: `${config.apiURL}/providers/`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			body: {
				provider: {
					"name": req.body.name,
					"description": req.body.description,
					"websiteURL": req.body.websiteURL,
					"logoURL": req.body.logoURL,
					"addCreditRecordCallbackURL": req.body.addCreditRecordCallbackURL,
					"phone": req.body.phone,
					"email": req.body.email,					
					"creditToPointsMultiplier": req.body.creditToPointsMultiplier,
					"industries": industries
				}
			},
			json: true 
		};
		
		const result = await rp(options);

		await sleep(6000);

		res.redirect(`/Provider/${result.response.transaction_id}`);
	}));

	app.get('/AddPartner', awaitHandlerFactory(async (req, res) => {
		res.render('addpartner', {title: "Add a CEBlocks Partner"});
	}));

	app.post('/AddPartner', awaitHandlerFactory(async (req, res) => {
		
		let industries = req.body.industries.join(",");

		const options = {
			method: 'POST',
			uri: `${config.apiURL}/partners/`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			body: {
				partner: {
					"name": req.body.name,
					"description": req.body.description,
					"websiteURL": req.body.websiteURL,
					"logoURL": req.body.logoURL,
					"phone": req.body.phone,
					"email": req.body.email,										
					"industries": industries
				}
			},
			json: true 
		};
		
		const result = await rp(options);

		await sleep(6000);

		res.redirect(`/Partner/${result.response.transaction_id}`);
	}));

	app.get('/Marketplace/Redeem', awaitHandlerFactory(async (req, res) => {	
		const customerId = cryptojs.AES.decrypt(req.cookies.customerId, config.salt).toString(cryptojs.enc.Utf8);

		const options = {
			method: 'POST',
			uri: `${config.apiURL}/redeem-marketplace/`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			body: {
				redemption: {
					"customerId": customerId,
					"memo": "Redemption at marketplace partner Levenger",					
					"points": 10
				}
			},
			json: true 
		};
		
		const result = await rp(options);

		res.json({success: true});
	}));

	app.get('/Marketplace/', awaitHandlerFactory(async (req, res) => {	

		const customerId = cryptojs.AES.decrypt(req.cookies.customerId, config.salt).toString(cryptojs.enc.Utf8);
		
		let options = {
			method: 'GET',
			uri: `${config.apiURL}/customers/details/${customerId}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true 
		};
		
		const customer = await rp(options);

		tokenBalance = customer.points;

		let industriesAll = [];

		for (var i=0; i < customer.participants.length; i++)
		{
			tokenBalance += customer.participants[i].points;

			industriesAll = [...industriesAll, ...customer.participants[i].provider.industries.split(",")];
		}

		const industryList = [...new Set(industriesAll)].join(",");

		options = {
			method: 'GET',
			uri: `${config.apiURL}/partners/industries/${industryList}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true 
		};
		
		const partners = await rp(options);

		for (var i=0; i<partners.length; i++)
		{
			if (partners[i].name == "Levenger")
			{
				partners[i].offers = [
					{
						"name": "$10 Off Writing Implements",						
						"cost": 10,
						"coupon": "LCEB001",
						"imageURL": "https://www.levimage.com/image/Web/Product/Miscellaneous_Products/AP18015_CROSS_TOWNSEND_2020_YEAR_OF_THE_RAT_SE_ROLLERBALL_222.jpg",
						"shopURL": "https://www.levenger.com/writing-8.aspx",
						"disabled": tokenBalance < 10
					}
				]
			}

			if (partners[i].name == "mycase")
			{
				partners[i].offers = [
					{
						"name": "3 Months of MyCase for FREE",
						"cost": 45,
						"coupon": "MYC001",
						"imageURL": "https://learn.mycase.com/www/v2/images/desktop/shared/pricing-2_720x491.png",
						"shopURL": "https://mycase.com",
						"disabled": tokenBalance < 45
					}
				]
			}
		}

		res.render('marketplace', {title: "CEBlocks Partner Marketplace", customer: customer, tokenBalance: tokenBalance.toFixed(2), partners: partners});
	}));

	app.get('/Dashboard/', awaitHandlerFactory(async (req, res) => {	

		const customerId = cryptojs.AES.decrypt(req.cookies.customerId, config.salt).toString(cryptojs.enc.Utf8);
		
		const options = {
			method: 'GET',
			uri: `${config.apiURL}/customers/details/${customerId}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true 
		};
		
		const customer = await rp(options);

		tokenBalance = customer.points;

		creditRecords = [];

		for (var i=0; i < customer.participants.length; i++)
		{
			tokenBalance += customer.participants[i].points;

			for (var j=0; j < customer.participants[i].creditRecords.length; j++)
			{
				customer.participants[i].creditRecords[j].providerName = customer.participants[i].provider.name;
				creditRecords.push(customer.participants[i].creditRecords[j]);
			}
			
		}

		res.render('dashboard', {title: "CEBlocks Dashboard", customer: customer, tokenBalance: tokenBalance.toFixed(2), creditRecords: creditRecords});
	}));

	app.get('/Login/', awaitHandlerFactory(async (req, res) => {		
		res.render('login', {title: "Log In to Your CEBlocks Account", layout: "simple.handlebars", creditRecordId: req.params.creditRecordId});
	}));

	app.post('/Login', awaitHandlerFactory(async (req, res) => {
		
		const options = {
			method: 'POST',
			uri: `${config.apiURL}/authenticateCustomer`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			body: {
				email: req.body.email,
				password: req.body.password
			},
			json: true 
		};
		
		const result = await rp(options);

		// Set a cookie and redirect to dashboard //
		// +++ TODO: IMPLEMENT JWT: THIS IS NOT SECURE +++ //		
		res.cookie("customerId", cryptojs.AES.encrypt(`${result.id}`, config.salt).toString()).redirect("/Dashboard");		
	}));

	app.get('/Register/:creditRecordId', awaitHandlerFactory(async (req, res) => {		
		res.render('register', {title: "Create a CEBlocks Account", layout: "simple.handlebars", creditRecordId: req.params.creditRecordId});
	}));

	app.post('/Register', awaitHandlerFactory(async (req, res) => {
		
		const options = {
			method: 'POST',
			uri: `${config.apiURL}/customers/fromCreditRecord`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			body: {
				email: req.body.email,
				password: req.body.password,
				encryptedCustomerIdentifier: req.body.encryptedCustomerIdentifier,
				creditRecordId: req.body.creditRecordId
			},
			json: true 
		};
		
		const result = await rp(options);

		res.redirect("/Login");		
	}));

	app.get('/ProviderCertificate/:creditRecordCertificateFileKey', awaitHandlerFactory(async (req, res) => {
		
		const creditRecordCertificateFileObj = await rp({
			uri: `${config.apiURL}/certificate-file/${req.params.creditRecordCertificateFileKey}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true
		});

		var file = Buffer.from(creditRecordCertificateFileObj.data, 'base64');

		res.writeHead(200, {
		  'Content-Type': 'application/pdf',
		  'Content-Length': file.length
		});
		res.end(file); 
	}));

	app.get('/CreditRecord/:creditRecordId', awaitHandlerFactory(async (req, res) => {

		const creditRecord = await rp({
			uri: `${config.apiURL}/credit-records/${req.params.creditRecordId}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true
		});

		const provider = await rp({
			uri: `${config.apiURL}/providers/${creditRecord.providerId}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true
		});		

		const participant = await rp({
			uri: `${config.apiURL}/participants/${creditRecord.participantId}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true
		});	

		const verifications = await rp({
			uri: `${config.apiURL}/verifications/${creditRecord.id}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true
		});	

		const showCEBInfo = (typeof req.query.c === "undefined" && req.query.c != "true");

		res.render('creditrecord', {title: "CEBlocks Record of Credit Earned", layout: "simple.handlebars", creditRecord: creditRecord, provider: provider, participant: participant, verifications: verifications, showCEBInfo: showCEBInfo});
	}));

	app.get('/Provider/:providerId', awaitHandlerFactory(async (req, res) => {

		const provider = await rp({
			uri: `${config.apiURL}/providers/${req.params.providerId}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true
		});		

		res.render('provider', {title: "CEBlocks Provider", layout: "simple.handlebars", provider: provider});
	}));

	app.get('/Partner/:partnerId', awaitHandlerFactory(async (req, res) => {

		const partner = await rp({
			uri: `${config.apiURL}/partners/${req.params.partnerId}`,
			headers: {
				"Authorization": `Basic ${config.auth}`
			},
			json: true
		});		

		res.render('partner', {title: "CEBlocks Partner", layout: "simple.handlebars", partner: partner});
	}));

    app.use(function (err, req, res, next) {
        console.log(err);

        res.render('error', {
            title: "CEBlocks Error",
            error: err,
            layout: "simple.handlebars"
        });
    });

	// In production (optionally) use port 80 or, if SSL available, use port 443 //
	const server = app.listen(3015, () => {
		console.log(`Express running → PORT ${server.address().port}`);
	});
}

main().then().catch(console.error)