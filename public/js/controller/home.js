define(['jquery'], function($){
    'use strict';

    var homeController = {
        dispatch : function(){
            $('navbar').trigger('update.navbar');                   
        }
    };

    return homeController;
});
