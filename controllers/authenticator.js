var _ = require('lodash');
var logger = require('../lib/logFactory').logger;
var conf = require('../config/confLoader').conf;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userProvider = require('../lib/providers/user');

/**
 * The Router manage controllers' action dispatch regarding URL routing. 
 * @exports controllers/router
 */
var Authenticator = {
    
    /**
     * Dispatch the routes
     * @public
     * @param {HttpServer} server - to apply the routes to
     */
    setup : function(server){    
        var apiPath = conf.get('server').apiPath;            
        
        passport.use('local', this._getLocalStrategy());
        
        server.use(passport.initialize());
        
        server.post('/auth', function(req, res, next){
            passport.authenticate('local', function(err, user, info) {
               if (err) { 
                    return next(err); 
                }
                if (!user) { 
                    return res.json({auth: false}); 
                }
                req.session_state.token = user.token;
                return res.json({auth: true, user: user});
            })(req, res, next);
        });

        //protect api
/*
        server.all(apiPath, function(req, res, next){
            var headerToken = req.header('XToken');
            var login = req.header('XLogin');
            //check the token match the session
            if(req.session_state.token === headerToken && !_.isEmpty(headerToken)){
                //check against the store
                userProvider.checkToken(login, headerToken, function checkingToken(err, valid){
                    if(err){
                        return next(err);
                    }
                    if(valid === true){
                        return next();
                    } else {
                        logger.error("Token not registered or don't match the session: %s : %s", login, headerToken);
                        return res.send(403);
                    }
                }); 
            } else {
                logger.error("Trying to access the api with wrong token: %s : %s <> %s", login, headerToken, req.session_state.token);
                return res.send(403);
            }
        }); */
    },

    _getLocalStrategy : function(){
        var parameters = {
            usernameField: 'login',
            passwordField: 'passwd'
        };
        return new LocalStrategy(parameters, function(login, passwd, done) {
            userProvider.auth(login, passwd, function(err, valid){
                if(err){
                    return done(err);
                }   
                if(valid !== true){
                    return done(null, false);
                }
                userProvider.get(login, function(err, user){
                    if(err){
                        return done(err);
                    }
                    userProvider.createToken(user.login, function(err, token){
                        if(err){
                            return done(err);
                        }
                        user.token = token;
                        return done(null, user);    
                    });
                });
            });
        });
    }
};

module.exports = exports = Authenticator;
