/**
 * Constructor
 * Instantiate the provider
 * @class ArticleProvider
 * @param {MongoStore} the mongo database store instance
 */
ArticleProvider = function(store) {
	this.collection = store.getCollection('articles');
	this.oid	= this.collection.db.bson_serializer.ObjectID;
};

/**
 * Priorities enum
 * @memberOf ArticleProvider
 * @static
 */
ArticleProvider.priority = {
		MUST_HAVE	 : "MUST_HAVE",
		NICE_TO_HAVE : "NICE_TO_HAVE" 
};

/**
 * Retrieve the article collection
 * @memberOf ArticleProvider
 * @param {Function} onSuccess callback
 * @param {Function} onError callback
 */
ArticleProvider.prototype.getCollection = function(priority, onSuccess, onError){
	this.collection.find({priority: priority}).toArray(function(err, articleCollection){
		if(err){
			onError(err);
		}
		else {
			var articles = {};
			for(index in articleCollection){
				var article = articleCollection[index];
				article._index = index;
				articles[article._id] = article;
			}
			onSuccess(articles);
		}
	});
};

/**
 * Get one article by it's identifier
 * @param id
 * @param onSuccess
 * @param onError
 */
ArticleProvider.prototype.getOne = function(id, onSuccess, onError){
	this.collection.find({'_id': this.oid.createFromHexString(id)}).nextObject(function(err, article){
		if(err){
			onError(err);
		}
		else {
			onSuccess(article);
		}
	});
};

