const express = require('express');
const exphbs = require('express-handlebars');

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
    
    var hbs = exphbs.create();

	app.engine('handlebars', hbs.engine);
	app.set('view engine', 'handlebars');

	app.use(express.urlencoded({ extended: true }))
	app.use('/public',  express.static(__dirname + '/public'));		
	app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

	app.get('/', awaitHandlerFactory(async (req, res) => {
		res.render('index', {title: "CEBlocks", layout: "simple.handlebars"});
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