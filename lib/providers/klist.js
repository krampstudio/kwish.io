var _ = require('lodash');
var client = require('../redisClientFactory').client;
var async = require('async');

var keys = {
    list : 'klist:',
    userlist : 'userklist:',
    itemid : 'kitemid:',
    item : 'kitem:',
    listitem : 'klistitem:'
};

/**
 * Get a title to create a sanitized id
 * @param {String} title - the list title
 * @param {String} rep - to replace non alphanum chars
 * @param {Number} [length] - the id length
 * @returns {String} an id 
 */
function idfy(title, rep, length){
    var id = title.replace(/\W/, rep).toLowerCase();
    return id.substr(0, length || id.length);
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
 * Gives you access to klist management.
 * @exports provider/klist
 */
var KlistProvider = {

    /**
     * Get the lists of a user
     * @param {String} login - the user login
     * @param {DataCallback} cb - with list in data
     */
    getUserLists : function(login, cb){
        client.smembers(keys.userlist + login, function(err, lists){

            if(err){
                return cb(new Error('Error while retrieving lists for user ' +  login + ' : ' + err));
            }
            cb(null, lists);
        });
    },
    
    /**
     * Save a list
     * @param {String} login - the user login
     * @param {String} id - the list id
     * @param {Object} list - the list data
     * @param {ConfirmCallback} cb - true if saved
     */
    save : function(login, id, list, cb){
        client.multi()
            .hmset(keys.list + id, list)
            .sadd(keys.userlist + login, id)
            .exec(function(errors, replies){
                if(errors){
                    return cb(new Error('Error while trying to add list ' + id +  ' : '  + errors));
                }
                cb(null, _.isArray(replies) && replies[0] === 'OK' && replies[1] === 1);
            });
    },

    /**
     * Delete a list
     * @param {String} login - the user login
     * @param {String} id - the list id
     * @param {ConfirmCallback} cb - true if deleted
     */
    del : function(login, id, cb){
        client.multi()
            .del(keys.list + id)
            .srem(keys.userlist + login, id)
            .exec(function(errors, replies){
                if(errors){
                    return cb(new Error('Error while trying to delete list ' + id +  ' : '  + errors));
                }
                cb(null, _.isArray(replies) && replies[0] === 1 && replies[1] === 1);
            });
    },

    /**
     * Get a unique list identifier from the list title
     * @param {String} title - the user title
     * @param {DataCallback} cb - the list id in param
     */
    getId : function(title, cb){
       var tries = ['', '-', '_'];
       var length = 8;
       var exists = true;
       var id;
       var i = 0;

       //try different id generation strategy until the id is available
       async.whilst(function(){
            return exists;
       }, function(whilstCb){

            if(length > title.length){
                title += '' + i;
            }
            id = idfy(title, tries[i % 3], length);
            i++;
            if(i % 3 === 0){
                length++;
            }
            client.exists(keys.list + id, function(err, found){
                if(err){
                    return whilstCb(new Error('Error while trying to check existence of id ' + id +  ' : '  + err));
                }
                exists = !!(found === 1);
                whilstCb();
            });
       }, function(err){
            if(err){
                return cb(err);
            }
            cb(null, id);
       });
    }
};

module.exports = exports = KlistProvider;
