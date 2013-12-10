var _ = require('lodash');
var conf = require('../../config/confLoader').conf;
var client = require('../redisClientFactory').client;
var crypto = require('crypto');
var uuid = require('node-uuid');
var keys = {
    user: 'user:',
    token: 'token:'
};

/**
 * Creates a hash from a password
 * @param {String} clearPwd - the password to hash
 * @returns {string} the hash
 */
function hash(clearPwd) {
    var algo = conf.get('auth').passwd.algo;
    var salt = conf.get('auth').passwd.salt;
    var pepr = conf.get('auth').passwd.pepper;
    
    return crypto.createHash(algo).update(pepr + clearPwd + salt).digest('hex');
}

/**
 * @callback DataCallback
 * @param {Error} err - nillable
 * @param {Object} data - the result
 */

/**
 * @callback ConfirmCallback
 * @param {Error} err - nillable
 * @param {Boolean} result
 */

/**
 * Gives you access to user management.
 * @exports provider/user
 */
var UserProvider = {

    /**
     * Get a user from it's login
     * @private
     * @param {String} login - the user login
     * @param {DataCallback} cb - with the resulting user
     */
    _get : function(login, cb){
        client.hgetall(keys.user + login, function(err, user){
            if(err){
                return cb(new Error('Error while retrieving ' + login + ' : ' + err));
            }
            cb(null, user);
        });
    },

    /**
     * Get a user from it's login, without the passwd field
     * @param {String} login - the user login
     * @param {DataCallback} cb - with the resulting user
     */
    get : function(login, cb){
        this._get(login, function(err, user){
            if(err){
                throw cb(err); 
            }
            cb(null, user ? _.omit(user, 'passwd') : null);
        });
    },


    /**
     * Save a user, overrides if it exists
     * @param {String} login - the user login
     * @param {Object} user - the user data
     * @param {ConfirmCallback} cb - true if saved
     */
    save : function(login, user, cb){
        if(user.passwd){
            user.passwd = hash(user.passwd);
        }
        client.hmset(keys.user + login, user, function(err, reply){
            if(err){
                return cb(new Error('Error while trying to add user ' + login +  ' : '  + err));
            }
            return cb(null, reply === 'OK');
        });   
    },

    /**
     * Delete a user
     * @param {String} login - the user login
     * @param {ConfirmCallback} cb - true if deleted
     */
    del : function(login, cb){
        client.del(keys.user + login, function(err, reply){
            if(err){
                return cb(new Error('Error while trying to remove user ' + login +  ' : '  + err));
            }
            return cb(null, reply === 1);
        });
    },

    /**
     * Check if the login already exists
     * @param {String} login - the user login
     * @param {ConfirmCallback} cb - true if exists
     */
    loginExists : function(login, cb){
        var self = this;

        client.exists(keys.user + login, function(err, reply){
            if(err){
                return cb(new Error('Error while checking if login ' + login +  ' exists : '  + err));
            }
            return cb(null, reply === 1);
        });
    },

    /**
     * Authenticate a user
     * @param {String} login - the user login
     * @param {String} passwd - the user password
     * @param {ConfirmCallback} cb - true if deleted
     */
    auth: function(login, passwd, cb){
        this._get(login, function(err, user){
            if(err){
                return cb(new Error('Error while retriving user ' + login +  ' : '  + err));
            }
            if(user !== null && user.passwd){
                return cb(null, hash(passwd) === user.passwd); 
            }
            return cb(null, false);
        });
    },

    /**
     * Get the auth token for a user
     * @param {String} login - the user login
     * @param {DataCallback} cb - with the token
     */
    getToken : function(login, cb){
        client.get(keys.token + login, function(err, token){
            if(err){
                return cb(new Error('Error while retriving token for ' + login +  ' : '  + err));
            }
            return cb(null, token);
        });
    },

    /**
     * Check a token
     * @param {String} login - the user login
     * @param {String} token - the user token
     * @param {ConfirmCallback} cb - true if the token match 
     */
    checkToken : function(login, token, cb){
        this.getToken(login, function gotToken(err, userToken){
           if(err){
                return cb(err);
           } 
           return cb(null, _.isString(userToken) && !_.isEmpty(userToken) && userToken === token);
        });
    },

    /**
     * Create the auth token for a user
     * @param {String} login - the user login
     * @param {DataCallback} cb - with the created token
     */
    createToken : function(login, cb){
        var token = uuid.v4(); 
        client.set(keys.token + login, token, function(err, reply){
            if(err){
                return cb(new Error('Error while creating token for ' + login +  ' : '  + err));
            }
            return cb(null, reply === 'OK' ? token : false);
        });
    }
};

module.exports = exports = UserProvider;
