
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + "/public")); 
});

require('./providers/article');
var articleProvider = new ArticleProvider('babywish', 'localhost', 27017);


var throwError = null;

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  throwError = function(err){
	throw err;
  };
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  throwError = function(err){
        console.error(err.stack);
  };
});

// Routes

app.get('/', function(req, res){
 articleProvider.getCollection(function(articles){
	console.log(articles)
	 res.render('index', {
    		title: 'Baby Wish List',
		articles : articles
 	 });
 },throwError);

});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
