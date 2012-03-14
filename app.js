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
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:prop.store.session.pass, store: new MemoryStore()}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + "/public")); 
});

//error configuration
var throwError = null;
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  throwError = function(err){
	  console.log("Error:");
	  console.log(err);
  };
});
app.configure('production', function(){
  express.logger();
  app.use(express.errorHandler()); 
  throwError = function(err){
	  console.log("Error at " + new Date().toString());  
	  next(err);
  };
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

app.get('/ipn', function(req, res){

	console.log(req);	 
	var https 		= require('https');
	
	 var paypalOpts = settingsProvider.get('paypal');	
	 var params = req.params;
	 params.cmd = '_notify-validate';
	 
	 var requestBody = '';
	 for (key in params){
		requestBody += key + '=' + params[key] + '&';
	}
	  var request = https.request({
		    host: 	paypalOpts.host,
		    method: paypalOpts.method,
		    path: 	paypalOpts.path,
		    headers: {'Content-Length': requestBody.length}
		  }, function (res) {
			  res.on('data', function (resp) {
		      var response = resp.toString();
		      if(response == 'VERFIED'){
		    	  
		    	  console.log('PAYPAL IPN BEGIN');
		    	  console.log(params);
		    	  console.log('PAYPAL IPN END');
		    	  
		    	  if(params.payment_status == 'Completed'){
		    		  
		    		  if(params.receiver_id == paypalOpts.fields.business){
		    		  
			    		  if(params.custom && (params.payer_email || params.payer_id ) && (params.payment_gross || params.mc_gross)){
			    			  var email = params.payer_email || params.payer_id;
			    			  var amount = params.payment_gross || params.mc_gross;
			    			  
			    			  articleProvider.getOne(params.custom, function(article){
				    			  bookingProvider.book(article, email, amount, throwError);
				    		  });
			    		  }
		    		  }
		    	  }
		      }
		  });
	  });
	  request.write(requestBody);
	  request.end();
	  request.on('error', throwError);
});

//on start
app.listen(prop.server.port, prop.server.address);
console.log("Express server listening %s on port %d in %s mode", app.address().address, app.address().port, app.settings.env);