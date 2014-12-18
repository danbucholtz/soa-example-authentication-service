var authenticationController = require('./controllers/AuthenticationController');

var service = require("soa-example-core-service");
var config = require("soa-example-service-config").config();

var app = service.createApiServer(config.authenticationServicePort);

app.post('/authenticate', authenticationController.authenticateUser);