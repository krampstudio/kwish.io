/**
 * Constructor
 * Instantiate the provider
 * @class ArticleProvider
 * @param {MongoStore} the mongo database store instance
 */
ArticleProvider = function(store) {
	this.collection = store.getCollection('articles');
};

/**
 * Retrieve the article collection
 * @memberOf ArticleProvider
 * @param {Function} onSuccess callback
 * @param {Function} onError callback
 */
ArticleProvider.prototype.getCollection = function(onSuccess, onError){
	this.collection.find().toArray(function(err, articleCollection){
		if(err){
			onError(err);
		}
		else {
			onSuccess(articleCollection);
		}
	});
};


