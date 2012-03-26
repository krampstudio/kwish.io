var Mongodb     = require('mongodb'); 

/**
 * Private Constructor, throw an exception, use getInstance instead 
 * 
 * @class MongoStore
 * @param {String} name the mongo database name
 * @param {String} host the mongo server host
 * @param {int}	   port	the mongo server port
 */
var MongoStore = function(name ,host, port){
	 if(MongoStore.caller != MongoStore.getInstance){
        throw new Error('Cannot be instanciated that way, use getInstance instead');   
	 }
     this.db = new Mongodb.Db(name, new Mongodb.Server(host, port, {auto_reconnect: true}, {}));
	 this.db.open(function(){
        console.log("connection to mongo opened");     
    });
};

/**
 * The single instance
 * @memberOf MongoStore
 */
MongoStore.self = null;

/**
 * Get the mongostore instance 
 * 
 * @class MongoStore
 * @param {String}  [name] the mongo database name
 * @param {String}  [host] the mongo server host
 * @param {int}     [port] the mongo server port
 */
MongoStore.getInstance = function(name ,host, port){
    if(this.self === null){
        this.self = new MongoStore(name ,host, port);
    }
    return this.self;
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

MongoStore.prototype.close = function(){
    if(this.db){
        this.db.close();  
        console.log("connection to mongo closed"); 
    }
};

module.exports = MongoStore;