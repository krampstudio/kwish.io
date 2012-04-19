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
 * 
 */
 
 /**
  * Main app file, bootstrap all the services and start the server loop
  */
"use strict";

//imports
var express         = require('express'),
    everyauth       = require('everyauth'),
    properties      = require('./properties'),
    MongoStore      = require('./system/mongostore'),
    Authenticator   = require('./system/authenticator'),
    BwValidator     = require('./system/bwvalidator'),
    ListController  = require('./controllers/list'),
    path            = require('path');
    
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

/**
 *  
 */
function getViewName(req){
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
    model: function setUpViewMode(req, res){
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
            if(path.existsSync(__dirname + '/public/scripts/views/'  + viewName + '.js')){
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
 
app.post('/site/checkLogin', function(req, res){    
     var login = req.param('login', null);
     if(login && login.trim().length > 0){
         authenticator.isLoginAvailable(login, function(err, isAvailable){
             if(err){
                console.error(err);
                res.send(500);
             }
             res.json({'available': isAvailable});
         });
     }
     else{
        res.json({});
     }
 });
 
 app.get('/site/newList', function(req, res){
     if(req.user && req.loggedIn){
         return res.render(getViewName(req));  
     }
     
     res.redirect('/site/login');
 });
 app.post('/site/newList', function(req, res){
     if(req.user && req.loggedIn){
        
        var name = req.param('name');
        
        var validator = new BwValidator();
         validator.check(name, 'Le champ nom est obligatoire.').notEmpty();
        if(name && name.trim().length > 0){
            validator.check(name, 'Le format du champ nom est invalide (Aucune ponctuation ni espace et entre 4 et 32 caractères).').isAlphanumeric().len(4,32);
        }
        
        var errors = validator.getErrors();
        if(errors.length > 0){
            return res.render(getViewName(req), {errors: errors});
        }
        
        var ListProvider = require('./providers/list');
        var listProvider = new ListProvider();
        listProvider.create(name, req.user, function(err, list){
            if(err){
                console.error(err);   
            }
            if(list){
                req.flash('info', 'Liste créée avec succès');
            }
            res.redirect('/');
        });
        
     }
     
   //  res.redirect('/site/login');
 });
 
 app.get('/site/*', function(req, res){
     res.render(getViewName(req));
 });
 
app.get('/list/:name', ListController.load);
app.get('/list/', ListController.error);

//on start
app.listen(
    properties.server.port, 
    properties.server.address
);
console.log("Express server listening %s on port %d in %s mode", properties.server.address, properties.server.port, app.settings.env);