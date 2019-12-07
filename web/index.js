const express = require('express');
const exphbs = require('express-handlebars');
const rp = require('request-promise');

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

	app.get('/CreditRecord/:creditRecordId', awaitHandlerFactory(async (req, res) => {

		const auth = Buffer.from("master:bca895c3-24c1-49dc-9885-59e0596109f7").toString("base64");

		const creditRecord = await rp({
			uri: `http://127.0.0.1:3030/credit-records/${req.params.creditRecordId}`,
			headers: {
				"Authorization": `Basic ${auth}`
			},
			json: true
		});

		const provider = await rp({
			uri: `http://127.0.0.1:3030/providers/${creditRecord.providerId}`,
			headers: {
				"Authorization": `Basic ${auth}`
			},
			json: true
		});		

		const participant = await rp({
			uri: `http://127.0.0.1:3030/participants/${creditRecord.participantId}`,
			headers: {
				"Authorization": `Basic ${auth}`
			},
			json: true
		});	

		const verifications = await rp({
			uri: `http://127.0.0.1:3030/verifications/${creditRecord.id}`,
			headers: {
				"Authorization": `Basic ${auth}`
			},
			json: true
		});	

		res.render('creditrecord', {title: "CEBlocks Record of Credit Earned", layout: "simple.handlebars", creditRecord: creditRecord, provider: provider, participant: participant, verifications: verifications});
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
	const server = app.listen(3015, '127.0.0.1', () => {
		console.log(`Express running → PORT ${server.address().port}`);
	});
}


main().then().catch(console.error)