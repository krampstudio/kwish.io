var redis = require("redis");
var logger = require('./logFactory').logger;
var conf = require('../config/confLoader').conf;
var redisConf = conf.get('store').redis;

function redisClientFactory(){

    var self = this;

	this.init = function(){

        var options = {};
        if(redisConf.auth){
            options.auth_pass = redisConf.auth;
        }

        self.client = redis.createClient(redisConf.host, redisConf.port, options);
        self.client.select(redisConf.db, function(){
            logger.info('Redis database %d selected on %s:%d', redisConf.db, redisConf.host, redisConf.port);
        });
        
        self.client.on('error', function(err){
            logger.err('Redis Error: %j', err);
        });
        
        return self.client;
	};

    return self;
}

/** 
 * Export the result of the factory, it can be cached and retrieved everywhere once initialized 
 */
module.exports = exports = redisClientFactory();
