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

var ListProvider    = require('../providers/list'),
    Authenticator   = require('../system/authenticator'),
    BwValidator     = require('../system/bwvalidator');

/**
 * @class SiteController
 */
var SiteController = {};

/**
 * @static
 * @memberOf SiteController
 */
SiteController.error = function(req, res){
    req.flash('error', 'Erreur inconnue');
    res.redirect('/');
};

/**
 * @static
 * @memberOf SiteController
 */
SiteController.checkLogin = function(req, res){
     var login = req.param('login', null);
     if(login && login.trim().length > 0){
         var authenticator = new Authenticator();
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
};

/**
 * @static
 * @memberOf SiteController
 */
SiteController.newListForm =  function(req, res){
    if(req.user && req.loggedIn){
        return res.render('site/new-list');  
    }
    
    res.redirect('/site/login');
};

/**
 * @static
 * @memberOf SiteController
 */
SiteController.createNewList = function(req, res){
    if(req.user && req.loggedIn){
    
        var name = req.param('name');
        
        var validator = new BwValidator();
        validator.check(name, 'Le champ nom est obligatoire.').notEmpty();
        if(name && name.trim().length > 0){
            validator.check(name, 'Le format du champ nom est invalide (Aucune ponctuation ni espace et entre 4 et 32 caractères).').isAlphanumeric().len(4,32);
        }
        
        var errors = validator.getErrors();
        if(errors.length > 0){
            return res.render('site/new-list', {errors: errors});
        }
        
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
};

module.exports=SiteController;
