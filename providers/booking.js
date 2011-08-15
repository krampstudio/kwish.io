/**
 * Constructor
 * Instantiate the provider
 * @class BookingProvider
 * @param {MongoStore} the mongo database store instance
 */
BookingProvider = function(store) {
	this.collection = store.getCollection('booking');
};

/**
 * Retrieve all the settings
 * @memberOf BookingProvider
 * @param {Function} onSuccess callback
 * @param {Function} onError callback
 */
BookingProvider.prototype.isBooked = function(onSuccess, onError){
	this.collection.find().toArray(function(err, settings){
		if(err){
			onError(err);
		}
		else{
			if(settings.length == 1){
				self.settings = settings[0]; 	
			}
		}
		return settings;
	});
};
