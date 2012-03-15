/**
 * Node.js Main file
 * 
 * 
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @version 0.1
 * 
 */

// Import Dependencies
var express 	= require('express');
var MemoryStore = require('./node_modules/express/node_modules/connect/lib/middleware/session/memory');

//Create the app instance
var app = module.exports = express.createServer();

//Main  Configuration
require('./properties');
var prop = new Properties();

app.configure(function(){
  if(prop.app){
	  for(key in prop.app){
		app.set(key, prop.app[key]);
	}
  }
  app.register(".html", require("jqtpl").express);
  app.use(express.logger("tiny"));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:prop.store.session.pass, store: new MemoryStore()}));
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


//Load Models providers
require('./system/mongostore');
require('./providers/article');
require('./providers/booking');
require('./providers/user');
require('./providers/settings');

var mongoStore			= new MongoStore(
		prop.store.db.name, 
		prop.store.db.host, 
		prop.store.db.port, 
		{native_parser: true}
	);
var articleProvider 	= new ArticleProvider(mongoStore);
var bookingProvider		= new BookingProvider(mongoStore);
var userProvider		= new UserProvider(mongoStore);
var settingsProvider	= new SettingsProvider(mongoStore);
settingsProvider.load();

// Routes

/*
 *  Index
 */
app.get('/', function(req, res){
	 res.render('index', {
    		title		: 'Bienvenu sur la liste de naissance de Ditlinde',
    		user		: req.session.user || null
	 });
 });


/*
 * Login
 */
app.post('/login', function(req,res){
	userProvider.login( req.body.login, req.body.passwd, function(user){
		if(user == null){
			res.send({valid: false});
		}
		else{
			
			req.session.user = user;
			res.send({valid: true});
		}
	});
});

/*
 * Logout
 */
app.get('/logout', function(req, res){
	req.session.user = null;
	res.redirect('/');
});

//on start
app.listen(prop.server.port, prop.server.address);
console.log("Express server listening %s on port %d in %s mode", prop.server.address, prop.server.port, app.settings.env);