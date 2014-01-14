var _ = require('lodash');
var logger = require('../lib/logFactory').logger;
var conf = require('../config/confLoader').conf;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userProvider = require('../lib/providers/user');

/**
 * The authenticator setup auth strategies and authorization mechanism
 * @exports controllers/authenticator
 */
var Authenticator = {
    
    /**
     * Set up the authenticator
     * @public
     * @param {HttpServer} server - to apply the routes to
     * @param {Array} [strategies] - the list of auth strategies to set up  
     */
    setup : function(server, strategies){
        var self = this;
        strategies = strategies || ['local'];   
        
        logger.debug("Setup authenticator with strategies : %j", strategies);
        
        //initialize strategies
        _.forEach(strategies, function(strategy){
            if(_.isFunction(self.strategy[strategy])){
                passport.use('local', self.strategy[strategy].call(self));
            }
        });

        //set up passport
        server.use(passport.initialize());
                
        //register auth routes by strategy
        _.forEach(strategies, function(strategy){
            if(_.isFunction(self.auth[strategy])){
                server.post('/auth-' + strategy,  self.auth[strategy].call(self));
            }
        });

        //bind logout 
        server.get('/logout', self.logout);

        //protect api
        server.use(this.authorize());
    },

    auth : {

        /**
         * Provides local authentication method
         * @returns {Function} basic routing handler 
         */
        local : function(){
            return function localAuth(req, res, next){
                var auth = passport.authenticate('local', function(err, user, info) {
                    if (err) { 
                        return next(err); 
                    }
                    if (!user) { 
                        return res.json({auth: false}); 
                    }
                    req.session_state.token = user.token;
                    return res.json({ 
                        auth: true, 
                        user: user
                    });
                });
                auth(req, res, next);
            };
        }
    },

    strategy : {

        /**
         * Provides local auth strategy, that check user against userProvider
         * @returns {LocalStrategy}  
         */
        local : function(){
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
                        userProvider.createToken(login, function(err, token){
                            if(err){
                                return done(err);
                            }
                            user.token = token;
                            user.login = login;
                            return done(null, user);    
                        });
                    });
                });
            });
        }
    },

    /**
     * Provides an authorization check using the token from the XToken header 
     * @returns {Function} basic routing handler 
     */
    authorize : function(){
        var apiPath = conf.get('server').apiPath;            
        var protectedPath = new RegExp( apiPath.replace(/\//, "\\/") + "\\/*", 'g');

        logger.debug("Protecting %s", apiPath);

        return function authorizeHandler(req, res, next){
            var headerToken, login;
            
            if(!protectedPath.test(req.url)){
                return next();
            }

            headerToken = req.header('XToken');
            login = req.header('XLogin');
            
            //check the token match the session
            if(req.session_state.token === headerToken && !_.isEmpty(headerToken)){
                //check against the store
                userProvider.checkToken(login, headerToken, function checkingToken(err, valid){
                    if(err){
                        return next(err);
                    }
                    if(valid === true){
                        logger.debug("Allowing req to %s for token %s", req.url, headerToken);
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
        };
    },

    logout : function(req, res, next){
        return res.json({'logout' : true}); 
    }
};

module.exports = exports = Authenticator;
