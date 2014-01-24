define(['jquery', 'lodash'], function($, _){
    'use strict';


    var defaults = {
        control : '.ctrl',
        menu :  '.options'
    };

    /**
     * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
     * @exports components/dropMenu
     * @example $('container').dropMenu();
     */
    var dropMenu = {

        /**
         * Plugin initialisation
         * @public
         * @returns {jQueryElement} for chaining
         */
        init : function(options){
            var self = dropMenu;
            options = _.default(options, defaults);
            return this.each(function(){
                var $elt = $(this);
                if(!$elt.data('dropMenu')){

                    var $control = $(options.control, $elt);                    
                    var $menu = $(options.menu, $elt);                    

                    $elt.data('dropMenu', _.merge(options, {
                        $control : $control,
                        $menu : $menu
                    }));

                    $menu.hide();

                    $control.click(function(e){
                        e.preventDefault();
                    });

                    $elt.trigger('create.dropMenu');
                }
            });
        },

        /**
         * Plugin desctruction, unbind events
         * @public
         * @returns {jQueryElement} for chaining
         */
        destroy : function(){
            return this.each(function(){
                var $elt = $(this);
                var data = $elt.data('dropMenu');
            });
        }
    };

    //register the plugin to jQuery
    $.fn.dropMenu = function(method) {
        if (_.isFunction(dropMenu[method])){
            if(/^_/.test(method)){
                $.error('Trying to call a private method : ' + method);
            } else {
                return dropMenu[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        } else if ( typeof method === 'object' || ! method ) {
            return dropMenu.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };
});
