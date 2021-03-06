var klistProvider = require('../lib/providers/klist');
var logger = require('../lib/logFactory').logger;
var _ = require('lodash');
var util = require('util');

//todo externalize and integrate with validation
function _error(res, msg){
    return res.json({
        error : {
            from : 'klist',
            message : util.format.apply(util, Array.prototype.slice.call(arguments, 1)) 
        }
    });
}

/**
 * Provides actions to manage a list
 * @exports controllers/user
 */ 
var KListController = {
 
    /**
     * Get a list from it's id
     * @param {HttpRequest} req - json only
     * @param {HttpResponse} res - send json
     * @param {Function} next - to move to middleware next stack
     */
    get : function (req, res, next) {
        var klistId = req.params.id;
        var login = req.header('XLogin');
        if(req.accepts('application/json') && /^\w+$/.test(klistId) && !_.isEmpty(login)){
            klistProvider.getList(klistId, function(err, list){
                if(err){
                    return _error(res, err.message);
                }
                if(_.isEmpty(list)){
                    return _error(res, "No list found for %s", klistId);
                }
                //check if the list belongs to the current user
                klistProvider.getUserLists(login, function(err, lists){ 
                    if(err){
                        return _error(res, err.message);
                    }
                    if(! _.contains(lists, klistId)){
                        return _error(res, "Not authorize to get list %s", klistId);
                    }
                    return res.json(list);
                });
            });
        } else { 
            logger.debug("Invalid request for getting list, go to next");
            return next();
        }
    },

    /**
     * Get user's lists
     * @param {HttpRequest} req - json only
     * @param {HttpResponse} res - send json
     * @param {Function} next - to move to middleware next stack
     */
    getLists : function(req, res, next){
        var login = req.header('XLogin');
        if(req.accepts('application/json') && !_.isEmpty(login)){
            klistProvider.getUserLists(login, function(err, lists){ 
                if(err){
                    return _error(res, err.message);
                }
                return res.json(lists);
            });
        } else { 
            logger.debug("Invalid request for getting lists, go to next");
            return next();
        }
    }
};

module.exports = KListController;
