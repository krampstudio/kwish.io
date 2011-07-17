var Mongodb = require('mongodb'); 

/**
 * Constructor
 * Instantiate the store
 * @class MongoStore
 * @param {String} name the mongo database name
 * @param {String} host the mongo server host
 * @param {int}	   port	the mongo server port
 */
MongoStore = function(name ,host, port){
	 this.db = new Mongodb.Db(name, new Mongodb.Server(host, port, {auto_reconnect: true}, {}));
	 this.db.open(function(){});
};

/**
 * Get the database connection instance
 * @memberOf MongoStore
 * @returns {Mongodb.Db}
 */
MongoStore.prototype.getDb = function(){
	return this.db;
};

/**
 * Get a collection instance
 * @memberOf MongoStore
 * @param {String} collectionName
 * @returns {Mongodb.Collection}
 */
MongoStore.prototype.getCollection = function(collectionName){
	return new Mongodb.Collection(this.db, collectionName);
};