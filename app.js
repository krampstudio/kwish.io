/**
 * Node.js Main file
 * 
 * 
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @version 0.1
 * 
 */

var express     = require('express'),
    everyauth   = require('everyauth'),
    util        = require('util'),
    properties  = require('./properties');
    
    
console.log(util.inspect(properties));

everyauth.twitter
            .consumerKey(properties.auth.twitter.consumerKey)
            .consumerSecret(properties.auth.twitter.consumerSecret)
            .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
               
                console.log(util.inspect(session));
                console.log(util.inspect(accessToken));
                console.log(util.inspect(accessTokenSecret));
                console.log(util.inspect(twitterUserMetadata));
                
                var promise = this.Promise();
                
                return promise;
            })
            .redirectPath('/');

console.log(util.inspect(everyauth.twitter.configurable()));

//Create the app instance
var app = express.createServer();

app.configure(function(){
  if(properties.app){
	  for(var key in properties.app){
		app.set(key, properties.app[key]);
	}
  }
  app.register(".html", require("jqtpl").express);
//  app.use(express.logger("tiny"));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:properties.store.session.pass}));
  app.use(everyauth.middleware());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + "/public")); 
});

//error configuration
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes

app.get('/', function(req, res){
	 res.render('index', {
        title: 'BabyWishList',
        user : req.session.user || null
	 });
 });

app.get('/signin', function(req, res){
     res.render('signin', {
        title: 'BabyWishList',
        user : req.session.user || null
	 });
 });



//on start
app.listen(
    properties.server.port, 
    properties.server.address
);
console.log("Express server listening %s on port %d in %s mode", properties.server.address, properties.server.port, app.settings.env);