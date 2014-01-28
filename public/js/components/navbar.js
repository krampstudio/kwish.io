define(['jquery', 'lodash', 'core/nav', 'core/session'], function($, _, nav, session){
    'use strict';

    /**
     * The Navigation Bar component, registered as a jquery plugin
     * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
     * @exports components/navbar
     * @example $('nav').navbar();
     */
    var navbar = {

        /**
         * Plugin initialisation
         * @public
         * @returns {jQueryElement} for chaining
         */
        init : function(){
            var self = navbar;
            return this.each(function(){
                var $elt = $(this);
                if(!$elt.data('navbar')){
                    $elt.data('navbar', {
                        $loginMenu : $('.login-menu', $elt),
                        $logoutMenu : $('.logout-menu', $elt),
                        $logout : $('#logout', $elt)
                    });
                        
                    /**
                     * @event navbar#update.navbar
                     */    
                    $elt.on('update.navbar', function(){
                        self._updateLoginMenu($elt);
                    });

                    //update the login menu on initialisation
                    self._updateLoginMenu($elt);
  
                    $elt.trigger('create.navbar');
                }
            });
        },

        /**
         * Update the login/logout menu regarding the current session
         * @private
         * @param {jQueryElement} $elt - the current element
         */
        _updateLoginMenu : function($elt){
            var self = this;
            var data = $elt.data('navbar');
            var login = session.get('login');
            if(login && _.isString(login) && !_.isEmpty(login)){
                data.$loginMenu.hide();        
                data.$logoutMenu.show().find('li:first-child > a').text(login);    
                data.$logout.on('click', function(e){
                    e.preventDefault();
                    nav.api('/logout', function(data){
                        session.rm('login');
                        session.rm('token');
                        self._updateLoginMenu($elt);
                        nav.open('home');
                    });
                });
            } else {
                data.$loginMenu.show(); 
                data.$logoutMenu.hide().find('li:first-child > a').text('');
                data.$logout.off('click');
            }
        },

        /**
         * Plugin desctruction, unbind events
         * @public
         * @returns {jQueryElement} for chaining
         */
        destroy : function(){
            return this.each(function(){
                var $elt = $(this);
                var data = $elt.data('navbar');
                    
                $elt.off('update.navbar');
                data.$logout.off('click');
            });
        }
    };

    //register the plugin to jQuery
    $.fn.navbar = function(method) {
        if (_.isFunction(navbar[method])){
            if(/^_/.test(method)){
                $.error('Trying to call a private method : ' + method);
            } else {
                return navbar[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        } else if ( typeof method === 'object' || ! method ) {
            return navbar.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };
});
