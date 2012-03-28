var MongoStore   = require('../system/mongostore');

//TODO setup a mongo link between _id and id

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
    this.oid = this.collection.db.bson_serializer.ObjectID;
};

UserProvider.prototype.getOne = function(id, callbck){
     this.collection.findOne({'_id': this.oid.createFromHexString(id)}, function(err, user){
        if(err){
            callbck(err);   
        }
        else{
            user.id = user._id;
            callbck(null, user);
        }
     });
};

UserProvider.prototype.findOneBy = function(parameters, callback){
     this.collection.findOne(parameters, function(err, user){
        if(err){
            callback(err);   
        }
        else{
            user.id = user._id;
            callback(null, user);
        }
     });
};

UserProvider.prototype.save = function(user, callback){
    var self = this;
    this.collection.update({login: user.login}, {$set : user}, {'upsert' : true, 'new': true}, function(err){
        if(err){
            callback(err);   
        }
        else{
            self.findOneBy({login: user.login}, callback);
        }
	});
};

module.exports = UserProvider;