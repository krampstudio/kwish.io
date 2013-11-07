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
 * @version 0.1.0 
 */

var conf = require('./config/confLoader').init();
var logConf = conf.get('log');
var serverConf = conf.get('server');

var lf = require('./lib/logFactory');

 //first of all initialize the logger
var logger = lf.init(lf.levels[logConf.level], logConf.stdout, logConf.file); 
 
var restify = require('restify');
var server = restify.createServer({
    log : logger
}); 

server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get(/\.(html)|(css)|(js)|(png)$/, restify.serveStatic({ directory : './public' }));

server.listen(serverConf.port, serverConf.address, function(){
    logger.info("Server started using %j", serverConf);
});
/**
  * Main app file, bootstrap all the services and start the server loop
  */
/*(function () {
    "use strict";

    //imports
    var express         = require('express'),
        everyauth       = require('everyauth'),
        properties      = require('./properties'),
        MongoStore      = require('./system/mongostore'),
        Authenticator   = require('./system/authenticator'),
        BwValidator     = require('./system/bwvalidator'),
        ListController  = require('./controllers/list'),
        SiteController  = require('./controllers/site'),
        path            = require('path'),
	fs		= require('fs');
    
    //initialize the mongodb store
    MongoStore.init(properties.store.db);
    
    //auth
    var authenticator = new Authenticator(properties.auth);
    authenticator.setUp();
    
    //Create the app instance
    var app = express.createServer();
    app.configure(function appConf(){
        
        //dynamic configuration reagrding properties.app 
        if(properties.app){
            for(var key in properties.app){
                app.set(key, properties.app[key]);
            }
        }
      
        app.register(".html", require("jqtpl").express);
        app.use(express.static(__dirname + "/public"));
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({secret:properties.store.session.pass}));
        app.use(everyauth.middleware());
        app.use(express.methodOverride());
        app.use(app.router);
    });
    
    //error configuration
    app.configure('development', function appConfDev(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });
    
    app.configure('production', function appConfProd(){
        app.use(express.errorHandler());
        app.use(express.logger("tiny"));
    });
  */  
    /**
     * Get the view name from the request path
     * @param {Object} req request
     * @return {String} the name of the view to display
     */
    /*function getViewName(req){
        return req.path.replace(properties.app.baseUrl, '')
                        .replace(/^\/+/, '')
                        .replace(/\/$/, '')
                        .replace(/([A-Z])/g, function($1){
                                return "-"+$1.toLowerCase();
                            })+'';
    }
    
    //register view helpers
    
    //add everyauth
    everyauth.helpExpress(app);
    
    //global templates variables
    app.dynamicHelpers({
        model: function setUpViewModel(req){
            //set the flash messages to a var because they're cleaned by getting them
            var flashInfos = req.flash('info');
            var flashErrors = req.flash('error');
            var model =  {
                title        : 'BabyWishList',
                flashInfos   : flashInfos.length > 0 ? JSON.stringify(flashInfos) : false,
                flashErrors  : flashErrors.length > 0 ? JSON.stringify(flashErrors) : false
            };
    
            var viewName = getViewName(req);
            if(viewName.length > 0){
                //set the view name to global model
                model.view = viewName;
                //add the path of  client script to load regarding the view
                if(fs.existsSync(__dirname + '/public/scripts/views/'  + viewName + '.js')){
                    model.viewScript = viewName + '.js';
                }
            }
                
            return model;
        }
    });
    
    // Routes
    app.get('/', function(req, res){
        res.render('index');
    });
    app.post('/site/checkLogin', SiteController.checkLogin);
    app.get('/site/newList', SiteController.newListForm);
    app.post('/site/newList', SiteController.createNewList);
    app.get('/site/*', function(req, res){
        res.render(getViewName(req));
    });
    app.get('/list/:name', ListController.load);
    app.get('/list/data/:name', ListController.getOne);
    app.post('/list/articles', ListController.getArticles);
    app.get('/list', ListController.error);
    
    
    
    
    //on start
    app.listen(
        properties.server.port, 
        properties.server.address
    );
    console.log("Express server listening %s on port %d in %s mode", properties.server.address, properties.server.port, app.settings.env);

})();*/
