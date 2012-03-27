var Properties = function(){
    this.server = {
		'address'		: '127.0.0.1',
		'port'			: 3000
	};
	this.app = {
		'views'			: __dirname + '/views',
        'view engine'	: 'html',
        'baseUrl'		: ''	
    };
	this.store = {
		'session': {
			'pass' : 'xxx'
		},
		'db' :{
            'name'      :'babywish',
            'host'      :'localhost',
            'port'      : 27017
		}
	};
    this.auth = {
        'twitter' : {
            'consumerKey'   : 'xxx',
            'consumerSecret': 'xxx'
        }
    };
};

//to be required 
exports.Properties = Properties;