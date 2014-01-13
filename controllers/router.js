var _ = require('lodash');
var logger = require('../lib/logFactory').logger;
var conf = require('../config/confLoader').conf;

var UserController = require('./user');
var KListController = require('./klist');

/**
 * The Router manage controllers' action dispatch regarding URL routing. 
 * @exports controllers/router
 */
var Router = {
    
    /**
     * Contains the routes mapping
     * @type {Object}
     */
    routes : {
        'user/:login' : {
            method : 'get',
            action : UserController.get
        },
        'klist/:id' : {
            method : 'get',
            action : KListController.get
        }
    },

    /**
     * Dispatch the routes
     * @public
     * @param {HttpServer} server - to apply the routes to
     */
    dispatch : function(server){
        var apiPath = conf.get('server').apiPath;
        logger.debug("Dispatch routes into %s",apiPath);

        _.forEach(this.routes, function(mapping, route){
            if(!/\/$/.test(apiPath) && !/^\//.test(route)){
                apiPath += '/';
            }
            route = apiPath + route;
            if(typeof server[mapping.method] === 'function' && typeof mapping.action === 'function'){
                logger.debug("Serve %s on using %j", route, mapping);
                server[mapping.method](route, mapping.action);
            }
        });
    }
};

module.exports = exports = Router;
