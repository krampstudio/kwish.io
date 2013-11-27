var redis = require("redis");
var logger = require('./logFactory').logger;
var cache = {};

/**
 * Gives you a configured instance of the redis client.
 * Init can be called once, then you can access the client property from other modules.
 * @example //module a 
 *          var client = require(./redisClientFactory').init(conf); 
 *          
 *          //module b after a
 *          var client = require(./redisClientFactory').client; 
 *
 * @exports rediClientFactory
 */
function redisClientFactory(){
    var self = this;
    
    /**
     * Initialize the redis client
     * @param {Object} conf - the redis configuration
     * @param {String} conf.host - the redis host
     * @param {Number} conf.port - the redis port
     * @param {String} [conf.auth] - the redis password
     * @param {Number} conf.db - the redis database number to select
     * @returns {RedisClient} 
     */
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
