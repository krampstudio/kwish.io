var _ = require('lodash');
var client = require('../redisClientFactory').client;

var keys = {
    list : 'klist:',
    userlist : 'userklist:',
    itemid : 'kitemid:',
    item : 'kitem:',
    listitem : 'klistitem:'
};

var KlistProvider = {

    getUserLists : function(login, cb){
        client.smembers(keys.userlist + login, function(err, lists){

            if(err){
                return cb(new Error('Error while retrieving lists for user ' +  login + ' : ' + err));
            }
            cb(null, lists);
        });
    },
    
    add : function(login, id, list, cb){
        if(!login){
           return cb(new Error('Login is required to add a list'));
        }
        client.multi()
            .hmset(keys.list + id, list)
            .sadd(keys.userklist + login, id)
            .exec(function(errors, replies){
                if(errors){
                    return cb(new Error('Error while trying to add list ' + id +  ' : '  + errors));
                }
                cb(null, _.isArray(replies) && replies[0] === 'OK' && replies[1] === 1);
            });
    }

};

module.exports = exports = KlistProvider;
