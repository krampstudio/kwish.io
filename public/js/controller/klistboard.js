define(['jquery', 'core/nav', 'components/selectBox'], function($, nav){
    'use strict';

    var currentList;



    var klistboardController = {
        
        dispatch : function(){
           
//           this.getList('ditasbirth');
            this.getLists(function gotLists(lists){
                $('#klist-selector').selectBox();
            });

        },

        getLists : function(cb){
            var url = 'klists';
            nav.api(url, cb);
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
