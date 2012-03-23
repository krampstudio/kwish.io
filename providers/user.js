var hashlib = require('hashlib2'),
    MongoStore   = require('../system/mongostore');

/**
 * Constructor
 * Instantiate the provider
 * @class UserProvider
 */
var UserProvider = function() {
    this.store = MongoStore.getInstance();
    if(this.store === null){
        throw new Error('Store not initialized');   
    }
	this.collection = this.store.getCollection('users');
};

UserProvider.prototype.findOneBy = function(parameters, callback){
     this.collection.findOne(parameters, function(err, user){
        if(err){
            callback(err);   
        }
        else{
            callback(null, user);
        }
     });
};

UserProvider.prototype.save = function(user, callback){
    this.collection.update({email: user.email}, {$set : user}, {upsert : true}, function(err, user){
        if(err){
            callback(err);   
        }
        else{
            callback(null, user);
        }
	});
};


/**
 * Login
 * @memberOf UserProvider
 * @param {Function} onSuccess callback
 * @param {Function} onError callback
 
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

*/

module.exports = UserProvider;