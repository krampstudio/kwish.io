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
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:'b4b1w15h35', store: new MemoryStore()}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + "/public")); 
});

//error configuration
var throwError = null;
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  throwError = function(err){
	  console.error(err.stack);
  };
});
app.configure('production', function(){
  app.use(express.errorHandler()); 
  throwError = function(err){
        console.error(err.stack);
  };
});


//Load Models providers
require('./system/mongostore');
require('./providers/article');
require('./providers/user');

var mongoStore		= new MongoStore('babywish', 'localhost', 27017, {native_parser: true});
var articleProvider = new ArticleProvider(mongoStore);
var userProvider	= new UserProvider(mongoStore);



// Routes

/*
 *  Index
 */
app.get('/', function(req, res){
	 res.render('index', {
    		title		: 'Baby Wish List',
    		user		: req.session.user || null
	 });
 },throwError);
	
/*
 * List articles
 */
app.get('/list', function(req, res){
	articleProvider.getCollection(function(articles){
		 res.render('list', {
			 	title		: "list",
			 	layout		: false,
	    		articles	: articles
	 	 });
}, throwError);
	
/*
 * Article
 */
app.get('/article', function(req, res){
	articleProvider.getOne(req.param('id'), function(article){
			res.render('article', {
				 	title		: "article",
				 	layout		: false,
		    		article		: article
		 	 });
	});
}, throwError);

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
	}, throwError);
});

/*
 * Logout
 */
app.get('/logout', function(req, res){
	req.session.user = null;
	res.redirect('/');
});


//on start
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
