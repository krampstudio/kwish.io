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
 * 
 */
 
/**
 * @requires everyauth
 */
var everyauth   = require('everyauth'),
    UserProvider= require('../providers/user');

/**
 * This class use EveryAuth to implement authentication services
 * 
 * @class Authenticator
 * 
 * @param {Object} settings
 * @param {Number} [settings.timeout] everyauth login timeout
 * @param {Object} [settings.twitter] 
 */ 
var Authenticator = function(settings){
    this.settings = settings;
    this.userProvider =  new UserProvider();
};

/**
 * Global initialisation 
 * @memberOf Authenticator
 */
Authenticator.prototype._init = function(){
    
    var userProvider = this.userProvider;
    
    //how everyauth get a user
    everyauth.everymodule.findUserById( function (id, callback) {
        userProvider.getOne(id, callback);
    });
    
    //we set the timeout
    everyauth.everymodule.moduleTimeout(this.settings.timeout || 10000);
};

/**
 * Twitter authentication 
 * @memberOf Authenticator
 */
Authenticator.prototype.setUpTwitter = function(){

    var userProvider = this.userProvider;
    
    //login using twitter oauth
    everyauth.twitter
        .consumerKey(this.settings.twitter.consumerKey)
        .consumerSecret(this.settings.twitter.consumerSecret)
        .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
            var promise = this.Promise();
            var user = {
                'login'     : twitterUserMetadata.screen_name,
                'name'      : twitterUserMetadata.name,
                'twitter'   : {
                    'id' : twitterUserMetadata.id
                }
            };
            userProvider.save(user, function(err, userData){
                 if(err){
                    console.error(err);   
                    promise.fail(err);
                 }
                 userData.id = userData._id;
                 promise.fulfill(userData);
            });
            return promise;
        })
        .redirectPath('/');
};

/**
 * Facebook authentication 
 * @memberOf Authenticator
 */
Authenticator.prototype.setUpFacebook = function(){
    
    var userProvider = this.userProvider;
    
    everyauth.facebook
        .appId(this.settings.facebook.appId)
        .appSecret(this.settings.facebook.appSecret)
        .scope('email')
        .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
            var promise = this.Promise();
           
            var user = {
                'login'     : fbUserMetadata.username,
                'name'      : fbUserMetadata.name,
                'facebook'   : {
                    'id' : fbUserMetadata.id
                }
            };
            if(fbUserMetadata.email){
                user.email = fbUserMetadata.email;
            }
           
            userProvider.save(user, function(err, userData){
                 if(err){
                    console.error(err);   
                    promise.fail(err);
                 }
                 userData.id = userData._id;
                 promise.fulfill(userData);
            });
            return promise;
  })
  .redirectPath('/');  
};

Authenticator.prototype.setUpGoogle = function(){
    
    var userProvider = this.userProvider;
    
   //HERE
};

/**
 * Set up all the authentication methods
 * @memberOf Authenticator
 */
Authenticator.prototype.setUp = function(){
    this._init();
    this.setUpTwitter();
    this.setUpFacebook();
};

//export the MongoStore to be required
module.exports = Authenticator;