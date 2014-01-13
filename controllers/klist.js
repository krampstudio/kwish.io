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
        if(req.accepts('application/json') && /^\w+$/.test(klistId)){
            klistProvider.getList(klistId, function(err, list){
                if(err){
                    return _error(res, err.message);
                }
                if(_.isEmpty(list)){
                    return _error(res, "No list found for %s", klistId);
                }
                //check if the list belongs to the current user
                klistProvider.getUserLists(req.header('XLogin'), function(err, lists){ 
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
            next();
        }
    }
};

module.exports = KListController;
