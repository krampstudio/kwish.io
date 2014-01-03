define(['modernizr', 'jquery'], function(Modernizr, $){
    'use strict';

    var history = {
        popState : function(cb){
            if(Modernizr.history){
                $(window).on('popstate', function(e){
                    if(typeof cb === 'function'){
                        cb(e.originalEvent.state || {}, document.location);
                    }
                });
            }
        },

        pushState : function(state, title, url){
            if(Modernizr.history){
                window.history.pushState(state, title, url);
            }
        }
    };

    return history;
});
