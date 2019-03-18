const 	express = require('express'),
		extParams = require('./extParams'),
		app = express();

// routers
const	router = require('./api/routes/routes')();

// constants
const	PORT = extParams.port,
		APP_NAME = extParams.appName;


app.use('/', express.static('dist'));
  
app.use('/create', router);


app.listen(PORT, function () {
	console.log(`${APP_NAME} listening on port ${PORT}!`)
});

module.exports = app