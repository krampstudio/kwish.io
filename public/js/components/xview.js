/**
 * Register the <x-view> component
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license AGPLv3
 */
define(['xtag', 'core/session'], function(xtag, session){
    'use strict';

    /**
     * The available view levels
     */
    var levels = [
        'anonymous',
        'user',
        'admin'
    ];

    /**
     * Compute the level of the current user from the session
     * @returns {String} level
     */
    var computeLevel = function computeLevel(){

        var levelIndex = 0;     //anonymous

        var login = session.get('login');
        if(typeof login === 'string' && login.length > 0){
            levelIndex++;       //user

            if(session.get('admin') === true){
                levelIndex++;       //admin
            }
        }
        return levels[levelIndex];
    };

    /**
     * Regsiter the <x-view> component
     */
    xtag.register('x-view', {
        lifecycle:{
            created: function(){
                this._display = this.style.display;
            }
        },
        accessors : {
            level : {
                attribute : {},

                set : function(value){
                   if(value && computeLevel() === value){
                        this.style.display = this._display;
                   } else {
                        this.style.display = 'none';
                   }
                }
            }
        }
    });
});
