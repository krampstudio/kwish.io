/**
 * BabyWishList Platform : A web application to build cool baby wish lists 
 * Copyright (C) 2012  Bertrand CHEVRIER, KrampStudio
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/agpl-3.0.txt
 * 
 * @author <a href="mailto:chevrier.bertrand@gmail.com">Bertrand Chevrier</a>
 * @license http://www.gnu.org/licenses/agpl-3.0.txt
 * @version 0.2.0
 */


var MongoStore  = require('../system/mongostore'),
    DBRef       = require('mongodb').DBRef,
    util        = require('util');

/**
 * This class provides us the services 
 * to manage lists against the store
 * 
 * @class ListProvider
 */
var ListProvider = function() {
    
    //we get the mongoStore singleton
    this.store = MongoStore.getInstance();
    if(this.store === null){
        throw new Error('Store not initialized');   
    }

    //the user collection inside the store
    this.collection = this.store.getCollection('lists');
};

/**
 * Placeholder data used for new lists
 * @type {Object}
 * @static
 * @memberOf ListProvider
 */
ListProvider.placeholder = {
    title : 'Titre de la liste',
    description : "Texte d'introduction et de description"
};

/**
 * Possible list states
 * @type {Object}
 * @static
 * @memberOf ListProvider
 */
ListProvider.state = {
    published   : 'published',  //list is available
    staging     : 'staging',    //list is waiting to be published
    building    : 'building'    //list is under construction    
};

/**
 * Possible list visibility
 * @type {Object}
 * @static
 * @memberOf ListProvider
 */
ListProvider.visibility = {
    open        : 'open',       //publicly available
    closed      : 'closed',     //available only by it's owner
    shared      : 'shared',     //only available through the link
    restricted  : 'restricted'  //restricted to a list of member
};

/**
 * Create a new list
 * @param {Object} user the user the list belongs to
 * @param {Function} callback(error, insertedList)
 * @memberOf ListProvider
 */
ListProvider.prototype.create = function(title, user, callback){
    if(user && user.id && title.trim().length > 0){
        
        var list = {
            title       : ListProvider.placeholder.title,
            description : ListProvider.placeholder.description,
            user        : new DBRef('users', user._id, this.store.db.databaseName),
            state       : ListProvider.state.building,
            visibility  : ListProvider.visibility.closed
        };
        
        this.collection.insert(list, {safe: true}, function(err, lists){
            if(err){
                callback(err);   
            }
            else if(lists !== null && util.isArray(lists) && lists.length > 0){
                callback(null, lists[0]);   
            }
        }); 
    }
};

module.exports = ListProvider;