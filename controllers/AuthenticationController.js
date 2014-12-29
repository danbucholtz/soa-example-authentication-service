var userService = require("soa-example-user-service-api");
var utils = require("soa-example-core-utils");

//var //loggerServiceApi = require('soa-example-logging-service-api');

var Q = require("q");

var authenticateUser = function(req, res){
	var emailAddress = req.body.emailAddress;
	var password = req.body.password;

	var accessToken = req.body.accessToken;

	// try the access token first
	if ( accessToken ){
		authenticateUserAccessToken(accessToken).then(function(authenticatedUser){
			if ( authenticatedUser ){
				res.send({ success:true, user: authenticatedUser });
			}
			else{
				res.send({success:false, user: null});
			}
		});
	}
	else{
		// try email and password auth
		authenticateUserUsernamePassword(emailAddress, password).then(function(authenticatedUser){
			if ( authenticatedUser ){
				res.send({ success:true, user: authenticatedUser });
			}
			else{
				res.send({success:false, user: null});
			}
		});
	}
};

var authenticateUserAccessToken = function(token){
	var deferred = Q.defer();

	//loggerServiceApi.debug("system", "Access Token [" + token + "] authenticating ...");

	// get the user
	userService.getUserByToken(token).then(function(user){
		if ( user && token == user.accessToken ){
			//loggerServiceApi.debug("system", "Access Token [" + token + "] authenticating ... Success");
			deferred.resolve(user);
		}
		//loggerServiceApi.debug("system", "Access Token [" + token + "] authenticating ... Fail");
		deferred.resolve(null);
	});

	return deferred.promise;
};

/* Private Methods */

var authenticateUserUsernamePassword = function(emailAddress, password){
	var deferred = Q.defer();

	//loggerServiceApi.debug("system", "User [" + emailAddress + "] authenticating ...");

	// get the user
	userService.getUserByEmailAddress(emailAddress).then(function(user){
		if ( user ){
			var hashedPassword = utils.hashPassword(password, user.salt);
			if ( hashedPassword == user.password ){
				//loggerServiceApi.debug("system", "User [" + emailAddress + "] authenticating ... Success");
				deferred.resolve(user);
				return;
			}
		}
		//loggerServiceApi.debug("system", "User [" + emailAddress + "] authenticating ... Fail");
		deferred.resolve(null);
	});

	return deferred.promise;
};

module.exports = {
	authenticateUser: authenticateUser
}