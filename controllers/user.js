var userProvider = require('../lib/providers/user');
var _ = require('lodash');

var userController = function(server){
 
   server.get('/user/:login', function (req, res, next) {
        var login = req.params.login;
        if(req.accepts('application/json') && /^[a-zA-Z0-9]+$/.test(login)){
            userProvider.get(login, function(err, user){
                if(err){
                    return res.json({error : err});
                }
                if(_.isEmpty(user)){
                    return res.json({error : "No user found for " + login});
                }
                console.log(user);
                return res.json(user);
            });
        }      
        next();
    });

    
};

module.exports = userController;
