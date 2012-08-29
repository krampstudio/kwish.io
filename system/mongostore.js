/**
 * BabyWishList Platform : A web application to build cool baby wish lists 
 * Copyright (C) 2012  Bertrand CHEVRIER, KrampStudio
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/agpl-3.0.txt
 * 
 * @author <a href="mailto:chevrier.bertrand@gmail.com">Bertrand Chevrier</a>
 * @license http://www.gnu.org/licenses/agpl-3.0.txt
 * @version 0.2.0
 */
 
/**
 * @requires mongodb
 */
var Mongodb     = require('mongodb'),
    util        = require('util'); 

/**
 * Private Constructor, throw an exception, use getInstance instead 
 * 
 * @class MongoStore
 * @private
 * 
 * @param {String} name the mongo database name
 * @param {String} host the mongo server host
 * @param {int}	   port	the mongo server port
 */
var MongoStore = function(){
	 if(MongoStore.caller != MongoStore.getInstance){
        throw new Error('Cannot be instanciated that way, use getInstance instead');   
	 }
     
     if(MongoStore.settings.replicaset === true && util.isArray(MongoStore.settings.host) ){
         
         var servers = [];
         for(var index in MongoStore.settings.host) {
             servers.push(new Mongodb.Server(
                    MongoStore.settings.host[index], 
                    MongoStore.settings.port, 
                    { auto_reconnect: true, useSsl:  MongoStore.settings.useSsl }
                ));
         }
            
         
         //connect to a replicat set
        this.db = new Mongodb.Db(
                MongoStore.settings.name, 
                new Mongodb.ReplSetServers(servers, {rs_name: "cluster"})
            );
        
     } else {
         //connect to a single instance
         this.db = new Mongodb.Db(
                    MongoStore.settings.name, 
                    new Mongodb.Server(
                        MongoStore.settings.host, 
                        MongoStore.settings.port, 
                        { auto_reconnect: true, useSsl:  MongoStore.settings.useSsl }, 
                        {}
                    )
                );
     }
     
    this.db.open(function(err){
         if(err){
           console.error(err);   
         } else {
            console.log("connection to mongodb opened on "+ MongoStore.settings.host +" using "+ MongoStore.settings.name);   
         }
    });
    
    if(MongoStore.settings.user){
        this.db.authenticate(MongoStore.settings.user, MongoStore.settings.pass, function(err){
            if(err){
               console.error(err);   
             } else {
                console.log(MongoStore.settings.user + " is now logged into the mongodb database");   
             }
        });
    }
};

/**
 * The single instance
 * @memberOf MongoStore
 * @private
 * @static
 * @type {MongoStore}
 */
MongoStore._self = null;

/**
 * An object containing store settings
 * @memberOf MongoStore
 * @static
 * @type {Object}
 */ 
MongoStore.settings = null;

/**
 * Get the mongostore instance 
 * @memberOf MongoStore
 * @static
 */
MongoStore.getInstance = function(){
    if(this._self === null){
        if(!this.settings){
            throw new Error("No settigns found! Initialise the store before to load it.");
        }
        this.settings.name = this.settings.name || 'babywish';
        this.settings.host = this.settings.host || 'localhost';
        this.settings.port = this.settings.port || 27017;
        this.settings.replicaset = this.settings.replicaset || false;
        this.settings.useSsl = this.settings.useSsl || false;
        this._self = new MongoStore();
    }
    return this._self;
};

/**
 * @param {Object} settings
 * @param {String} settings.name the mongo database name
 * @param {String} settings.host the mongo server host
 * @param {int}    settings.port the mongo server port
 * @memberOf MongoStore
 * @static
 */
MongoStore.init = function(settings){
    this.settings = settings;
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

//export the MongoStore to be required
module.exports = MongoStore;
