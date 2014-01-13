define(['core/nav'], function(nav){
    'use strict';

    var klistboardController = {
        dispatch : function(){

        },

        getList : function(login, name){
            var url = '/' + login + '/' + name;
            nav.api(url, function(list){
//                console.log(list);
            });
        }
    };

    return klistboardController;

});
