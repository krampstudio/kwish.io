Properties = function(){
	this.server = {
		'address'		: '127.0.0.1',
		'port'			: 3003
	};
	this.app = {
		'views'			: __dirname + '/views',
  		'view engine'	: 'html',
  		'baseUrl'		: ''	
    };
	this.store = {
		'session': {
			'pass' : 'password'
		},
		'db' :{
			'name'  	:'babywish',
			'host'		:'localhost',
			'port'	 	:27017
		}
	};
};
