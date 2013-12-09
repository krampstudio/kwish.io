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

var Bootstrap = require('./lib/bootstrap');
var restify = require('restify');

//initialization of services
var bootstrap = new Bootstrap();
bootstrap.on('error', function(err){
    console.error("Unable to bootstrap : " + err);
    process.exit();
});
bootstrap.start({
    conf: true,
    logger: true,
    redis: true
});

//create the http server
var logger = bootstrap.logger;
var serverConf = bootstrap.conf.get('server');
var server = restify.createServer(); 
var authenticator = require('./controllers/authenticator');
var router = require('./controllers/router');

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(function(req, res, next){
    logger.info("%s %s : %j", req.method, req.url, req.params);
    next();
});

//set up the auth mechanism
authenticator.setup(server);
    
//dispatch api controllers
router.dispatch(server);

//static resource loading
server.get(/.*/, restify.serveStatic({ 
    directory : './public', 
    default : 'index.html'
}));


server.listen(serverConf.port, serverConf.address, function(){
    logger.info("Server started using %j", serverConf);
});
