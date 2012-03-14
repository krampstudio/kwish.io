var hashlib = require('hashlib2');

/**
 * Constructor
 * Instantiate the provider
 * @class UserProvider
 * @param {MongoStore} the mongo database store instance
 */
UserProvider = function(store) {
	this.collection = store.getCollection('users');
};

/**
 * Login
 * @memberOf UserProvider
 * @param {Function} onSuccess callback
 * @param {Function} onError callback
 */
UserProvider.prototype.login = function(login, password, onSuccess, onError){
	this.collection.find({
		login: login,
		password: hashlib.sha1(password)
	}).toArray(function(err, users){
		if(err){
			onError(err);
		}
		else {
			if(users.length == 1){
				onSuccess(users[0]);
			}
			else{
				onSuccess(null);
			}
		}
	});
};

UserProvider.prototype.insert = function(user, onSuccess, onError){
	this.collection.findOne({email: user.email}).toArray(function(err, foundUser){
		if(err){
			onError(err);
		}
		else {
			if(!foundUser){
				this.collection.insert(user, {safe: true}, function(err, objects){
					if(err){
						onError(err);
					}
					else {
						onSuccess(objects);
					}
				});
			}
		}
	});
};
