Properties = function(){
	this.server = {
		'address'		: '127.0.0.1',
		'port'			: 3000
	};
	this.app = {
		'views'			: __dirname + 'views',
  		'view engine'	: 'jade',
  		'baseUrl'		: ''	
	};
	this.store = {
		'session': {
			'pass' : ''
		},
		'db' :{
			'name'  	: 'babywish',
			'host'		: 'localhost',
			'port'	 	: 27017,
		}
	};
};
