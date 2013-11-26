var _ = require('lodash');
var client = require('../redisClientFactory').client;
var crypto = require('crypto');
var baseKey = 'user:';
var salt = 'kwish';
var pepper = '4w3s0m3K';
var algo = 'sha256';

function hash(clearPwd) {
    return crypto.createHash(algo).update(pepper + clearPwd + salt).digest('hex');
}

var UserProvider = {

    get : function(login, cb){
        var key = baseKey + login;
        client.hgetall(key, function(err, user){
            if(err){
                return cb(new Error('Error while retrieving ' + key + ' : ' + err));
            }
            cb(null, user);
        });
    },
    
    add : function(login, user, cb){
        if(!login){
           return cb(new Error('Login is required to add a user'));
        }
        var key = baseKey + login;
        if(user.passwd){
            user.passwd = hash(user.passwd);
        }
        client.hmset(key, user, function(err, reply){
            if(err){
                return cb(new Error('Error while trying to add user ' + key +  ' : '  + err));
            }
            return cb(null, reply === 'OK');
        });   
    },

    del : function(login, cb){
        if(!login){
           return cb(new Error('Login is required to remove a user'));
        }
        var key = baseKey + login;
        client.del(key, function(err, reply){
            if(err){
                return cb(new Error('Error while trying to remove user ' + key +  ' : '  + err));
            }
            return cb(null, reply === 1);
        });
    },

    update : function(user, cb){
        if(!user.login){
           return cb(new Error('Login is required to update a user'));
        }
        //TODO        
    },

    save : function(login, user, cb){
        var self = this;
        if(!login){
           return cb(new Error('Login is required to save a user'));
        }
        this.get(login, function checkUserExists(err, gotUser){
            if(err){
                return cb(err);
            }
            if(_.isEmpty(gotUser)){
                return self.add(user, cb);
            } else {
                return self.update(user, cb);
            }
        });
    },

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
