var _ = require('lodash');
var async = require('async');
var redisCF = require('../redisClientFactory');
var client = redisCF.client;
var pool = redisCF.pool;

var keys = {
    list : 'klist:',
    userlist : 'userklist:',
    itemid : 'kitemid',
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
        pool.acquire(function(err, pooledClient){
            if(err){
                return cb(err);
            }
            pooledClient.multi()
                .hmset(keys.list + id, list)
                .sadd(keys.userlist + login, id)
                .exec(function(errors, replies){
                    pool.release(pooledClient);
                    if(errors){
                        return cb(new Error('Error while trying to add list ' + id +  ' : '  + errors));
                    }
                    cb(null, _.isArray(replies) && replies[0] === 'OK' && replies[1] === 1);
                });
        });
    },

    /**
     * Get the items ids of a list
     * @param {String} id - the list id
     * @param {DataCallback} cb - with an array of ids, sorted by score
     */
    getListItemsIds : function(id, cb){
        client.zrevrange(keys.listitem + id, 0, -1, function(err, ids){
          if(err){
                return cb(new Error('Error while retrieving items ids for list ' +  id + ' : ' + err));
          }
          cb(null, ids);
        });
    },

    /**
     * Get the items of a list
     * @param {String} id - the list id
     * @param {DataCallback} cb - with an array of items, sorted by score
     */
    getListItems : function(id, cb){
        this.getListItemsIds(id, function(err, itemIds){
            if(err){
                return cb(err);
            }
            if(itemIds.length === 0){
                return cb(null, []);
            }
            var tasks = _.map(itemIds, function(itemId){
                return function(taskCallback){
                    client.hgetall(keys.item + itemId, taskCallback);
                };
            });
            async.parallel(tasks, function(error, items){
                if(error){
                    return cb(new Error('Error while retrieving items for list ' +  id + ' : ' + error));
                }
                cb(null, items);
            });
        });        
    },

    /**
     * Add an item to a list
     * @param {String} id - the list id
     * @param {Object} item - the item to add
     * @param {ConfirmCallback} cb - true if added
     */
    addListItem : function(id, item, cb){
        client.incr(keys.itemid, function(err, itemid){
                if(err){
                    return cb(new Error('Error while incrementing item id  : ' + err));
                }
                client.zcard(keys.listitem + id, function(err, count){
                    if(err){
                        return cb(new Error('Error while getting listitems count for list ' + id + '  : ' + err));
                    }
                    
                    pool.acquire(function(err, pooledClient){
                        if(err){
                           return cb(err);
                        }
                        pooledClient.multi()
                             .hmset(keys.item + itemid, item)
                             .zadd(keys.listitem + id, (count + 1), itemid)
                             .exec(function(errors, replies){
                                pool.release(pooledClient);
                                if(errors){
                                    return cb(new Error('Error while trying to add item ' + itemid +  ' to list ' + id +  '  : '  + errors));
                                }
                                cb(null, _.isArray(replies) && replies[0] === 'OK' && replies[1] === 1);
                            });
                    });
                });
        });
    },

    /**
     * Delete a list
     * @param {String} login - the user login
     * @param {String} id - the list id
     * @param {ConfirmCallback} cb - true if deleted
     */
    del : function(login, id, cb){
       var toDelKeys = [keys.list + id];
       this.getListItemsIds(id, function(err, itemIds){
           if(err){
                return cb(err);
           }
           toDelKeys = toDelKeys.concat(_.map(itemIds, function(itemId){
                return keys.item + itemId;
           }));   
  
           pool.acquire(function(err, pooledClient){ 
                if(err){
                    return cb(err);
                }

                pooledClient.multi()
                    .del(toDelKeys)
                    .srem(keys.userlist + login, id)
                    .exec(function(errors, replies){
                        pool.release(pooledClient);
                        if(errors){
                            return cb(new Error('Error while trying to delete list ' + id +  ' : '  + errors));
                        }
                        cb(null, _.isArray(replies) && replies[0] === toDelKeys.length && replies[1] === 1);
                    });
            });
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

            //add a suffix if the title length isn't enough
            if(length > title.length){
                title += '' + i;
            }

            //generate the id
            id = idfy(title, tries[i % 3], length);

            i++;
            if(i % 3 === 0){
                length++;
            }

            //check the id exists
            client.exists(keys.list + id, function(err, found){
                if(err){
                    return whilstCb(new Error('Error while trying to check existence of id ' + id +  ' : '  + err));
                }
                exists = found === 1;
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
