var _ = require('lodash');
var logger = require('../lib/logFactory').logger;
var UserController = require('./user');

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
        }
    },

    /**
     * Dispatch the routes
     * @public
     * @param {HttpServer} server - to apply the routes to
     */
    dispatch : function(server){
        logger.debug("Dispatch routes");

        _.forEach(this.routes, function(mapping, route){
            if(typeof server[mapping.method] === 'function' && typeof mapping.action === 'function'){
                logger.debug("Serve %s on using %j", route, mapping);
                server[mapping.method](route, mapping.action);
            }
        });
    }
};

module.exports = exports = Router;
