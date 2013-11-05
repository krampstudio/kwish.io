var nconf = require('nconf');

function confLoader(){

    var self = this;
    var config = 'config/config.json';

    this.conf = {};

	this.init = function(){
        self.conf =  nconf
                    .argv()
                    .env()
                    .file({ file : config });
        return self.conf;
	};

    return self;
}

/** 
 * Export the result of the factory, it can be cached and retrieved everywhere once initialized 
 */
module.exports = exports = confLoader();
