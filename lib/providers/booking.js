var BSON = require('mongodb').BSONPure;

/**
 * Constructor
 * Instantiate the provider
 * @class BookingProvider
 * @param {MongoStore} the mongo database store instance
 */
BookingProvider = function(store) {
	this.store		= store;
	this.collection = this.store.getCollection('booking');
	this.serializer = this.collection.db.bson_serializer;
};

/**
 * 
 * @memberOf BookingProvider
 * @param {Function} onSuccess callback
 * @param {Function} onError callback
 */
BookingProvider.prototype.areBooked = function(articles, onSuccess, onError){
	this.collection.find().toArray(function(err, bookings){
		if(err){
			onError(err);
		}
		else{
			for(index in bookings){
				var booking = bookings[index];
				if(articles[booking.article.oid]){
					articles[booking.article.oid].booked = true;
				}
			}
			onSuccess(articles);
		}
	});	
};


BookingProvider.prototype.book = function(article, email, amount, onError){
	
	this.collection.update({
				'article': new BSON.DBRef('articles', article._id, this.store.db.databaseName)
			}, 
			{$set: {
					booked : new Date(),
					email  : email,
					amount : amount
				}
			},
			{safe: true, upsert:true, multi: false},
			onError
	);
};