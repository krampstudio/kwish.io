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
    ObjectID       = require('mongodb').ObjectID,
    util        = require('util');

/**
 * This class provides us the services 
 * to manage articles against the store
 * 
 * @class ArticleProvider
 */
var ArticleProvider = function() {
    
    //we get the mongoStore singleton
    this.store = MongoStore.getInstance();
    if(this.store === null){
        throw new Error('Store not initialized');   
    }

    //the user collection inside the store
    this.collection = this.store.getCollection('articles');
};

/**
 * Priorities enum
 * @memberOf ArticleProvider
 * @static
 */
ArticleProvider.priority = {
        MUST_HAVE       : "MUST_HAVE",
        NICE_TO_HAVE    : "NICE_TO_HAVE" 
};

/**
 * Retrieve all the articles of a list
 * @param {Object} list the name of the list to retrieve
 * @param {Object} options
 * @param {Function}  callback(error, foundList)
 * @memberOf ArticleProvider
 */
ArticleProvider.prototype.getAllByList = function(list, options, callback){
    if(list && list.id || list._id){
        
        var params = {};
        if(list._id) {
            params["list.$id"] = new ObjectID(list._id);
        }
        
        if(options.priority && ArticleProvider.priority[options.priority]){
            params.priority = options.priority;
        }
        
        this.collection.find(params).toArray(function onArticleFind(err, articles){
            if(err){
                return callback(err);   
            }
            if(articles !== null && articles.length > 0){
                callback(null, articles);   
            }
        });
    }
};

//export the class
module.exports = ArticleProvider;