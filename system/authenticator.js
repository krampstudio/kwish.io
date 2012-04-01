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
    UserProvider= require('../providers/user'),
    BwValidator = require('./bwvalidator'),
    util = require('util');

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
 * 
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
 * Set up login/password based authentication and registration
 * 
 * @memberOf Authenticator
 */
Authenticator.prototype.setUpLogin = function(){
  
    var userProvider = this.userProvider;
  
    everyauth.password
        .loginFormFieldName('bwlogin')
        .passwordFormFieldName('bwpass')
        .getLoginPath('/login') 
        .postLoginPath('/login') 
        .loginView('login')
        .authenticate( function (login, password) {

            console.log('authenticate');
            console.log(login);
            console.log(password);
            
            var promise = this.Promise();
            
            var testedUser = {
                login: login,
                email: login,
                password: password
            };
            
            userProvider.login(testedUser, function(err, loggedIn){
                if(err){
                    console.log('error');
                    console.log(err);
                    return promise.fulfill([err]);   
                
                }
                promise.fullfill(loggedIn);
            });
            return promise;
  })
  .loginSuccessRedirect('/') // Where to redirect to after a login
  .getRegisterPath('/register') // Uri path to the registration page
  .postRegisterPath('/register') // The Uri path that your registration form POSTs to
  .registerView('register')
  .extractExtraRegistrationParams( function (req) {
        return {
            email: req.body.email,
            passbis: req.body.passbis,
            firstname: req.body.firstname,
            lastname: req.body.lastname
          };
    })
  .validateRegistration( function (newUserAttributes) {
    console.log('validate');
    console.log(newUserAttributes);
    console.log('/validate');
    var validator = new BwValidator();
    validator.reset();
    
    validator.check(newUserAttributes.login, 'Le champ pseudo ne doit pas être vide.').notEmpty();
    if(newUserAttributes.login && newUserAttributes.login.trim().length > 0){
        validator.check(newUserAttributes.login, 'Le champ pseudo est mal formé ou invalide.').isAlphanumeric().len(4,32);
    }
    
    validator.check(newUserAttributes.email, 'Le champ email ne doit pas être vide.').notEmpty();
    if(newUserAttributes.login && newUserAttributes.login.trim().length > 0){
        validator.check(newUserAttributes.email, 'Le champ email est mal formé.').isEmail();
    }
    
    if(newUserAttributes.lastname && newUserAttributes.lastname.trim().length > 0){
        validator.check(newUserAttributes.lastname, 'Le champ nom est invalide.').len(1,32).is(/[a-zA-Z ']/);
    }
    
    if(newUserAttributes.firstname && newUserAttributes.firstname.trim().length > 0){
        validator.check(newUserAttributes.firstname, 'Le champ prénom est invalide.').len(1,32).is(/[a-zA-Z ']/);
    }
    
    validator.check(newUserAttributes.password, 'Le champ mot de passe ne doit pas être vide.').notEmpty();
    validator.check(newUserAttributes.passbis, 'Veuillez répéter le mot de passe.').notEmpty();
     if(newUserAttributes.password && newUserAttributes.password.trim().length > 0){
        validator.check(newUserAttributes.password, 'Le mot de passe est invalide (6 à 32 caratères, lettres et chiffres).').len(6,32).isAlphanumeric();
        validator.check(newUserAttributes.password, 'Les mots de passes ne correspondent pas.').equals(newUserAttributes.passbis);
     }

    return validator.getErrors();
  })
  .registerUser( function (newUserAttributes) {
      var promise = this.Promise();
      
      console.log('register');
     console.log(newUserAttributes);
     console.log('/register');
    // This step is only executed if we pass the validateRegistration step without
    // any errors.
    //
    // Returns a user (or a Promise that promises a user) after adding it to
    // some user store.
    //
    // As an edge case, sometimes your database may make you aware of violation
    // of the unique login index, so if this error is sent back in an async
    // callback, then you can just return that error as a single element array
    // containing just that error message, and everyauth will automatically handle
    // that as a failed registration. Again, you will have access to this error via
    // the `errors` local in your register view jade template.
    // e.g.,
    // var promise = this.Promise();
    // User.create(newUserAttributes, function (err, user) {
    //   if (err) return promise.fulfill([err]);
    //   promise.fulfill(user);
    // });
    // return promise;
    //
    // Note: Index and db-driven validations are the only validations that occur 
    // here; all other validations occur in the `validateRegistration` step documented above.
  })
  .registerSuccessRedirect('/'); // Where to redirect to after a successful registration

  
};

/**
 * Twitter OAuth2 authentication 
 * 
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
 * Facebook OAuth2 authentication 
 * 
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

/**
 * Google OAuth2 authentication
 * 
 * @memberOf Authenticator
 */
Authenticator.prototype.setUpGoogle = function(){
    
    var userProvider = this.userProvider;
    
    everyauth.google
        .appId(this.settings.google.appId)
        .appSecret(this.settings.google.appSecret)
        .scope('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')
        .findOrCreateUser( function (session, accessToken, accessTokExtra, googleUserMetadata) {
            var promise = this.Promise();
            var user = {
                'login'     : googleUserMetadata.email.split('@')[0],
                'name'      : googleUserMetadata.name,
                'email'     : googleUserMetadata.email,
                'google'    : {
                    'id' : googleUserMetadata.id
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
 * Set up all the authentications ways
 * 
 * @memberOf Authenticator
 */
Authenticator.prototype.setUp = function(){
    this._init();
    this.setUpLogin();
    this.setUpTwitter();
    this.setUpFacebook();
    this.setUpGoogle();
};

//export the Authenticator to be required
module.exports = Authenticator;