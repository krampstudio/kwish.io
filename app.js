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
  app.set('baseUrl', '');
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
	  console.log(err);
  };
});
app.configure('production', function(){
  express.logger();
  app.use(express.errorHandler()); 
  throwError = function(err){
        next(err);
  };
});


//Load Models providers
require('./system/mongostore');
require('./providers/article');
require('./providers/booking');
require('./providers/user');
require('./providers/settings');

var mongoStore			= new MongoStore('babywish', 'localhost', 27017, {native_parser: true});
var articleProvider 	= new ArticleProvider(mongoStore);
var bookingProvider		= new BookingProvider(mongoStore);
var userProvider		= new UserProvider(mongoStore);
var settingsProvider	= new SettingsProvider(mongoStore);
settingsProvider.load(throwError);

// Routes

/*
 *  Index
 */
app.get('/', function(req, res){
	 res.render('index', {
    		title		: 'Bienvenu sur la liste de naissance de Ditlinde',
    		user		: req.session.user || null
	 });
 },throwError);
	
/*
 * List articles
 */
app.get('/list', function(req, res){
	articleProvider.getCollection(ArticleProvider.priority.MUST_HAVE ,function(mustHaveArticles){
		bookingProvider.areBooked(mustHaveArticles, function(mustHaveArticles){
			
			articleProvider.getCollection(ArticleProvider.priority.NICE_TO_HAVE ,function(niceToHaveArticles){
				bookingProvider.areBooked(niceToHaveArticles, function(niceToHaveArticles){
					
					res.render('list', {
					 	title				: "list",
					 	layout				: false,
					 	mustHaveArticles	: mustHaveArticles,
					 	niceToHaveArticles	: niceToHaveArticles,
					 	lastArticle			: req.session.currentArticle || null
					});
					
				}, throwError);
			}, throwError);
		}, throwError);
	}, throwError);
});

	
/*
 * Article
 */
app.get('/article', function(req, res){
	articleProvider.getOne(req.param('id'), function(article){
			req.session.currentArticle = article;
			res.render('article', {
				 	title		: "article",
				 	layout		: false,
		    		baseUrl		: settingsProvider.get('baseUrl'),
				 	paypalOpts	: settingsProvider.get('paypal'),
				 	article		: article
		 	 });
	}, throwError);

});
app.post('/bookArticle', function(req, res){
	if(req.session.currentArticle && req.param('email')){
		var amount = (req.param('amount')) ? parseFloat(req.param('amount')) : 0.0;
		bookingProvider.book(req.session.currentArticle, req.param('email'), amount, throwError);
		res.send({valid: true});
		return;
	}
	res.send({valid: false});
});
app.post('/test', function(req, res){
	res.redirect('/');
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

app.error(function(err, req, res){
	  res.send('Error: ' + err);
});



//on start
app.listen(3000, '192.168.1.11');
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
console.log(app.address());