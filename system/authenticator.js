
var everyauth   = require('everyauth'),
    UserProvider= require('../providers/user');

var Authenticator = function(settings){
    this.settings = settings;
    this.userProvier =  new UserProvider();
};

Authenticator.prototype._init = function(){
    
    var userProvier = this.userProvier;
    
    //how everyauth get a user
    everyauth.everymodule.findUserById( function (id, callback) {
        userProvier.getOne(id, callback);
    });
    
    everyauth.everymodule.moduleTimeout(this.settings.timeout || 10000);
};

Authenticator.prototype.setUpTwitter = function(){

    var userProvier = this.userProvier;
    
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
            userProvier.save(user, function(err, user){
                 if(err){
                    console.error(err);   
                 }
                 user.id = user._id;
                 promise.fulfill(user);
            });
            return promise;
        })
        .redirectPath('/');
};

Authenticator.prototype.setUp = function(){
    this._init();
    this.setUpTwitter();
};

//export the MongoStore to be required
module.exports = Authenticator;