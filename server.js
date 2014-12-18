var authenticationController = require('./controllers/AuthenticationController');

var service = require("soa-example-core-service");
var config = require("soa-example-core-service-config").config();

var app = service.createServer(config.authenticationServiceIp);

app.post('/authenticate', authenticationController.authenticateUser);