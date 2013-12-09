var _ = require('lodash');
var logger = require('../lib/logFactory').logger;
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

        passport.use('local', this._getLocalStrategy());

        server.use(passport.initialize());
        server.get('/auth', function(req, res, next){
            passport.authenticate('local', function(err, user, info) {
               if (err) { 
                    return next(err); 
                }
                if (!user) { 
                    return res.json({auth: false}); 
                }

                return res.json({auth: true, user: user});
            })(req, res, next); 
        }); 
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
                    return done(null, user);    
                });
            });
        });
    }
};

module.exports = exports = Authenticator;
