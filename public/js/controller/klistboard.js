define(['core/nav'], function(nav){
    'use strict';

    var klistboardController = {
        dispatch : function(){
            this.getList('ditasbirth');
        },

        getList : function(name){
            var url = 'klist/' + name;
            nav.api(url, function(list){
                console.log(list);
            });
        }
    };

    return klistboardController;

});
