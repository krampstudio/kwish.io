var mongodb = require('mongodb'); 


/**
 * Constructor
 * Instantiate the provider
 * @class ArticleProvider
 * @param {String} name the mongo database name
 * @param {String} host the mongo server host
 * @param {int}	   port	the mongo server port
 */
ArticleProvider = function(name ,host, port) {
  this.db = new mongodb.Db(name, new mongodb.Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

/**
 * Retrieve the article collection
 * @memberOf ArticleProvider
 * @param {Function} onSuccess callback
 * @param {Function} onError callback
 */
ArticleProvider.prototype.getCollection = function(onSuccess, onError){
	var collection = new mongodb.Collection(this.db, 'articles');
	collection.find().toArray(function(err, articleCollection){
		if(err){
			onError(err);
		}
		else {
			onSuccess(articleCollection);
		}
	})
};


