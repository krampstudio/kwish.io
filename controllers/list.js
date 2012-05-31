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

var ListProvider = require('../providers/list'),
    ArticleProvider = require('../providers/article');

/**
 * @class ListController
 */
var ListController = {};

/**
 * @static
 * @memberOf ListController
 */
ListController.error = function(req, res){
    req.flash('error', 'Liste inconnue');
    res.redirect('/');
};

/**
 * @static
 * @memberOf ListController
 */
ListController.load = function(req, res){
     var name = req.param('name', null);
     
     //validate name
     
     if(name !== null){
        var listProvider = new ListProvider();
        listProvider.exists(name, function(err, found){
            if(err){
                console.log(err);   
            }
            if(found){
                res.render('list/index.html', {
                    layout  : false,
                    title   : name
                });
            }
            else{
               ListController.error(req, res);
            }
        });
     }
};

/**
 * @static
 * @memberOf ListController
 */
ListController.getOne = function(req, res){
    var name = req.param('name', null);  
      if(name !== null){
        var listProvider = new ListProvider();
        listProvider.getOneByName(name, function(err, foundList){
            if(!err && foundList){
                return res.json(foundList);
            }
            return res.json({error: err || "erreur de chargement de la liste"});
        });
     }
};

ListController.getArticles = function(req, res){
    var list = req.param('list', null);
    if(list !== null){
        var articleProvider = new ArticleProvider();
        articleProvider.getAllByList(list, {priority : ArticleProvider.priority.MUST_HAVE}, function(err, articles){
             if(!err && articles){
                return res.json(articles);
            }
            return res.json({error: err || "erreur de chargement des articles"});
        });
    }
}
module.exports=ListController;