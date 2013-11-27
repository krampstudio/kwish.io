var _ = require('lodash');
var client = require('../redisClientFactory').client;
var crypto = require('crypto');
var userKey = 'user:';
var salt = 'kwish';
var pepper = '4w3s0m3K';
var algo = 'sha256';

/**
 * Creates a hash from a password
 * @param {String} clearPwd - the password to hash
 * @returns {string} the hash
 */
function hash(clearPwd) {
    return crypto.createHash(algo).update(pepper + clearPwd + salt).digest('hex');
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
     * @param {String} login - the user login
     * @param {DataCallback} cb - with the resulting user
     */
    get : function(login, cb){
        client.hgetall(userKey + login, function(err, user){
            if(err){
                return cb(new Error('Error while retrieving ' + login + ' : ' + err));
            }
            cb(null, user);
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
        client.hmset(userKey + login, user, function(err, reply){
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
        client.del(userKey + login, function(err, reply){
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

        client.exists(userKey + login, function(err, reply){
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
        this.get(login, function(err, user){
            if(err){
                return cb(new Error('Error while retriving user ' + login +  ' : '  + err));
            }
            if(user !== null && user.passwd){
                return cb(null, hash(passwd) === user.passwd); 
            }
            return cb(null, false);
        });
    }
};

module.exports = exports = UserProvider;
