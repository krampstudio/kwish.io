// Dependencies
var express 	= require('express');
var MemoryStore = require('./node_modules/express/node_modules/connect/lib/middleware/session/memory');

var app = module.exports = express.createServer();

// Configuration
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


//Models
require('./system/mongostore');
require('./providers/article');
require('./providers/user');

var mongoStore		= new MongoStore('babywish', 'localhost', 27017);
var articleProvider = new ArticleProvider(mongoStore);
var userProvider	= new UserProvider(mongoStore);



// Routes

app.get('/', function(req, res){
	articleProvider.getCollection(function(articles){
	 res.render('index', {
    		title		: 'Baby Wish List',
    		articles	: articles,
    		user		: req.session.user || null
 	 });
 },throwError);

});
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

app.get('/logout', function(req, res){
	req.session.user = null;
	res.redirect('/');
});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
