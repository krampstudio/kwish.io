var redis = require("redis");
var logger = require('./logFactory').logger;
var cache = {};

function redisClientFactory(){
    var self = this;
    
    this.init = function(conf){
        self.client = redis.createClient(conf.port, conf.host);
        if(conf.auth){
            self.client.auth(conf.auth);
        }
        self.client.select(conf.db, function(){
            logger.info('Redis database %d selected on %s:%d', conf.db, conf.host, conf.port);
        });
        
        self.client.on('error', function(err){
            logger.err(err);
        });
        
        return self.client;
    };
    
    return this;
}

/** 
 * Export the result of the factory, it can be cached and retrieved everywhere once initialized 
 */
module.exports = exports = redisClientFactory.apply(cache);
