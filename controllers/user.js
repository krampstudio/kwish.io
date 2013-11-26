var userProvider = require('../lib/providers/user');
var _ = require('lodash');
var util = require('util');

//todo externalize and integrate with validation
function _error(res, msg){
    return res.json({
        error : {
            from : 'user',
            message : util.format.apply(util, Array.prototype.slice.call(arguments, 1)) 
        }
    });
}

/**
 * Provides actions to manage users
 * @exports controllers/user
 */ 
var UserController = {
 
    /**
     * Get a user from it's login
     * @param {HttpRequest} req - json only, login parameter
     * @param {HttpResponse} res - send json
     * @param {Function} next - to move to middleware next stack
     */
    get : function (req, res, next) {
        var login = req.params.login;
        if(req.accepts('application/json') && /^[a-zA-Z0-9]+$/.test(login)){
            userProvider.get(login, function(err, user){
                if(err){
                    return _error(res, err.message);
                }
                if(_.isEmpty(user)){
                    return _error(res, "No user found for %s", login);
                }
                return res.json(user);
            });
        }      
        next();
    }

};

module.exports = UserController;
