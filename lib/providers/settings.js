/**
 * Constructor
 * Instantiate the provider
 * @class SettingsProvider
 * @param {MongoStore} the mongo database store instance
 */
SettingsProvider = function(store) {
	this.collection = store.getCollection('settings');
	this.settings	= null;
};

/**
 * Load once all the settings
 * @memberOf SettingsProvider
 * @param {Function} onError callback
 */
SettingsProvider.prototype.load = function(onError){
	if(this.settings == null){
		var self = this;
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
	}
};

/**
 * Get all the settings
 * depends on {@link SettingsProvider#load}
 * @memberOf SettingsProvider
 * @returns the settings object
 */
SettingsProvider.prototype.getAll = function(){
	return this.settings;
};

/**
 * Get the value of a setting
 * depends on {@link SettingsProvider#load}
 * @memberOf SettingsProvider
 * @param {String} key
 * @returns the settings value
 */
SettingsProvider.prototype.get = function(key){
	return this.settings[key];
};