define(['modernizr', 'jquery'], function(Modernizr, $){
    'use strict';    

    var prefix = 'kwish:';

    var store;

    if(Modernizr.sessionstorage){
        store = window.sessionStorage;
    } else {
        $.error('Implement cookie store');
    }

    var Session = {
        
        get : function(key){
            return store.getItem(prefix + key);
        },

        set : function(key, value){
            store.setItem(prefix + key, value);
        },

        isset : function(key){
            return this.get(key) !== null; 
        },

        rm : function(key){
            store.removeItem(prefix + key);
        }
    };

    return Session;
});
