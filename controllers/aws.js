var awsProvider = require('../lib/providers/aws');
var logger = require('../lib/logFactory').logger;
var _ = require('lodash');
var util = require('util');

//todo externalize and integrate with validation
function _error(res, msg){
    return res.json({
        error : {
            from : 'aws',
            message : util.format.apply(util, Array.prototype.slice.call(arguments, 1)) 
        }
    });
}

/**
 * 
 * @exports controllers/aws
 */ 
var awsController = {
 
    /**
     * @param {HttpRequest} req - json only
     * @param {HttpResponse} res - send json
     * @param {Function} next - to move to middleware next stack
     */
    search : function (req, res, next) {
     
        var pattern = req.params.pattern;
        var index = req.params.index || 'All'; 
        if(req.accepts('application/json') && !_.isEmpty(pattern) && /^[a-zA-Z\u00df-\u00fc0-9 _\-:,;]{3,}$/i.test(pattern) ){
            awsProvider.search(pattern, index, function(err, result){
                if(err){
                    return _error(res, err.message);
                }
                return res.json(result);
            });
        } else { 
            logger.debug("Invalid search request, go to next");
            return next();
        }
    }
};

module.exports = awsController;
