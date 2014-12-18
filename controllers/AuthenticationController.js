var userService = require("soa-example-user-service-api");
var utils = require("soa-example-core-utils");

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

	// get the user
	userService.getUserByToken(token).then(function(user){
		if ( user && token == user.accessToken ){
			deferred.resolve(user);
		}
		deferred.resolve(null);
	});

	return deferred.promise;
};

/* Private Methods */

var authenticateUserUsernamePassword = function(emailAddress, password){
	var deferred = Q.defer();

	// get the user
	userService.getUserByEmailAddress(emailAddress).then(function(user){
		if ( user ){
			var hashedPassword = utils.hashPassword(password, user.salt);
			if ( hashedPassword == user.password ){
				deferred.resolve(user);
				return;
			}
		}
		deferred.resolve(null);
	});

	return deferred.promise;
};

module.exports = {
	authenticateUser: authenticateUser
}