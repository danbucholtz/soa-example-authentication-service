var userService = require("soa-example-user-service-api");
var utils = require("soa-example-core-utils");

var Q = require("q");

var authenticateUser = function(req, res){
	var emailAddress = req.body.emailAddress;
	var password = req.body.password;

	authenticateUserInternal(emailAddress, password).then(function(authenticatedUser){
		if ( authenticatedUser ){
			res.send({ success:true, user: authenticatedUser });
		}
		else{
			res.send({success:false, user: null});
		}
	});
};

/* Private Methods */

var authenticateUserInternal(emailAddress, password){
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