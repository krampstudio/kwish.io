/**
 * BabyWishList Platform : A web application to build cool baby wish lists 
 * Copyright (C) 2012  Bertrand CHEVRIER, KrampStudio
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/agpl-3.0.txt
 * 
 * @author <a href="mailto:chevrier.bertrand@gmail.com">Bertrand Chevrier</a>
 * @license http://www.gnu.org/licenses/agpl-3.0.txt
 * @version 0.2.0
 */

///////////////////////////////////////////////
//  TEMPLATE to be moved to properties.js   //
/////////////////////////////////////////////

/**
 * The class Properties is a singleton that provides 
 * application properties 
 * 
 * @class Properties
 * @throw Error by calling outside getInstance
 * @private
 */
var Properties = function(){
    if(Properties.caller != Properties.getInstance){
        throw new Error('Cannot be instanciated that way, use getInstance instead');   
    }
     
    this.server = {
    	'address'		: '0.0.0.0',
		'port'			: 80
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

/**
 * The single instance
 * @memberOf Properties
 * @static
 * @type {Properties}
 */
Properties.self = null;

/**
 * Get the properties instance 
 * @memberOf Properties
 * @static
 */
Properties.getInstance = function(){
    if(this.self === null){
        this.self = new Properties();
    }
    return this.self;
};

//to be required 
module.exports = Properties.getInstance();