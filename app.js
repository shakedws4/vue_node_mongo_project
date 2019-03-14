const 	express = require('express'),
		compression = require('compression'),
		bodyParser = require('body-parser'),
		multiParty = require('connect-multiparty'),
		expressValidator = require('express-validator'),
		methodOverride = require('method-override'),
		extParams = require('./extParams'),
		initApp = require('../ps-dashboard/shared/initApp'),
		app = express();

// routers
const	router = require('./api/routes/routes')();

// constants
const	PORT = extParams.port,
		APP_NAME = extParams.appName;


// define all app configurations
let allowCrossDomain = function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
};
app.use(allowCrossDomain);
app.use(compression());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
app.use(multiParty());
app.use(expressValidator());
app.use(methodOverride());

initApp(app, APP_NAME);  

app.use('/', express.static('dist'));
  
app.use('/create', router);


app.listen(PORT, function () {
	console.log(`${APP_NAME} listening on port ${PORT}!`)
});

module.exports = app