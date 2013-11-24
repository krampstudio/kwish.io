var _ = require('lodash');
var events = require('events');
var util = require('util');

//the default services to start
var defaults = {
    conf: true,
    logger : true,
    redis: false   
};

/**
 * The Bootstrap helps you to start transversal services
 * @exports Bootstrap
 * @constructor
 * @augments events.EventEmitter
 */
var Bootstrap = function(){
    //call constructor with the current context
    events.EventEmitter.call(this);
};
util.inherits(Bootstrap, events.EventEmitter);

/**
 * Start the services
 * 
 * @param {Object} [options] - the service to start as serviceName : boolean
 * @returns {Boostrap} for chaining
 */
Bootstrap.prototype.start = function(options){
    var self = this; 
    options = _.defaults(options || {}, defaults);
    _.each(options, function(start, service){
        if(start === true && typeof self[service] === 'function'){
            self[service]();
        }
    });
    this.emit('started', _.pick(this, _.keys(options)));

    return this;
};

Bootstrap.prototype.conf = function(){
    var confLoader = require('../config/confLoader');
    this.conf = confLoader.conf ? confLoader.conf : confLoader.init();
};

Bootstrap.prototype.logger = function(){
    var lf = require('./logFactory');
    if(lf.logger){
        this.logger = lf.logger;
        return;
    }
    if(this.conf){
        var logConf = this.conf.get('log');
        this.logger = lf.init(lf.levels[logConf.level], logConf.stdout, logConf.file);
    } else {
        this.emit('error', 'Cannot initialize logger if the configuration is not loaded');
    }
};

Bootstrap.prototype.redis = function(){
    var redisFactory = require('./redisClientFactory');
    if(redisFactory.client){
        this.redis = redisFactory.client;
        return;
    }
    if(this.conf){
        var redisConf = this.conf.get('store').redis;
        this.redis = redisFactory.client ? redisFactory.client : redisFactory.init(redisConf);
    } else {
        this.emit('error', 'Cannot initialize redis if the configuration is not loaded');
    }
};

module.exports = exports = Bootstrap;
