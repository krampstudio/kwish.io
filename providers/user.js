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


var MongoStore   = require('../system/mongostore'),
    crypto       = require('crypto'),
    util        = require('util');

//TODO setup a mongo link between _id and id

/**
 * This class provides us the services 
 * to manage user against the store
 * 
 * @class UserProvider
 */
var UserProvider = function() {
    
    //we get the mongoStore singleton
    this.store = MongoStore.getInstance();
    if(this.store === null){
        throw new Error('Store not initialized');   
    }

    //the user collection inside the store
    this.collection = this.store.getCollection('users');
};

/**
 * Get a user from it's id
 * 
 * @memberOf UserProvider
 * 
 * @param {Number} id the id of the user to find
 * @param {Function} callback callback(error, foundUser); 
 */ 
UserProvider.prototype.getOne = function(id, callbck){
     this.collection.findOne({'_id': this.oid.createFromHexString(id)}, function(err, user){
        if(err){
            callbck(err);   
        }
        else{
            user.id = user._id;
            callbck(null, user);
        }
     });
};

/**
 * Generic way to find a user
 * 
 * @memberOf UserProvider
 * 
 * @param {Object} parameter the parameter query to find a user
 * @param {Function} callback callback(error, savedUser); 
 */ 
UserProvider.prototype.findOneBy = function(parameters, callback){
     this.collection.findOne(parameters, function(err, user){
        if(err){
            callback(err);   
        }
        else{
            user.id = user._id;
            callback(null, user);
        }
     });
};

/**
 * Log in a user
 * 
 * @memberOf UserProvider
 * 
 * @param {Object} user the user to log in
 * @param {String} [user.login] or email
 * @param {String} [user.email] or login
 * @param {String} user.password the clear password
 * @param {Function} callback callback(error, loggedInUser); 
 */
UserProvider.prototype.login = function(user, callback){
    
    if(user.password){
        try{
            user.password = UserProvider.hashPass(user);
            var loginQuery = util.format("(this.login == '%s' || this.email == '%s')" +
                                    " && this.password == '%s'", 
                                    user.login, 
                                    user.email, 
                                    user.password
                                );
            console.log(loginQuery);
            this.collection.findOne({$where : loginQuery}, function(err, user){
                if(err){
                    callback(err);   
                }
                else{
                    if(user === null){
                        callback(new Error('Login failed!'));
                    }
                    else{
                        user.id = user._id;
                        callback(null, user);
                    }
                }
             });
            
        } catch(error){
            console.error(error);
        }
    }
    else{
        callback(new Error("No password found"));   
    }
};

/**
 * Save a user to the store
 * 
 * @memberOf UserProvider
 * 
 * @param {Object} user
 * @param {String} user.login the user insert/update choice is based uniquely on that field
 * @param {Function} callback callback(error, savedUser); 
 */ 
UserProvider.prototype.save = function(user, callback){
    
    var self = this;
    if(user.password){
        try{
            user.password = UserProvider.hashPass(user);
        } catch(error){
            console.error(error);
        }
    }
    this.collection.update({login: user.login}, {$set : user}, {'upsert' : true, 'new': true}, function(err){
        if(err){
            callback(err);   
        }
        else{
            self.findOneBy({login: user.login}, callback);
        }
	});
};

/**
 * Create a hash based on the user's password and salting method 
 * 
 * @memberOf UserProvider
 * @static
 * 
 * @param {Object} user
 * @param {String} user.login
 * @param {string} user.password
 * 
 * @return {String} the checksum
 */
UserProvider.hashPass = function(user){
    if(!user || !user.login || !user.password){
        throw new Error("Impossible to hash because of the invalid user paramter");   
    }
    var shasum      = crypto.createHash('sha1'),
        properties  = require('../properties');
        
    var pass    = user.password,
        login   = user.login,
        salt    = properties.auth.password.salt || 'sss',
        pepper  = properties.auth.password.pepper || 'ppp';
    
    shasum.update(login + salt + pass + pepper + login);   
    
    return shasum.digest('hex');
};

module.exports = UserProvider;