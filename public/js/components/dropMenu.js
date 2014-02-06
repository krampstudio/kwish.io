define(['jquery', 'lodash'], function($, _){
    'use strict';

    var defaults = {
        control : '.ctrl',
        menu :  '.options',
        menuTarget : 'a',
        action : 'replace',
        activeClass : 'active',
        mainClass : 'dropmenu'
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
            options = _.defaults(options || {}, defaults);
            return this.each(function(){
                var $elt = $(this);
                if(!$elt.data('dropMenu')){
                    
                    $elt.addClass(options.mainClass);
                     
                    var $control = $(options.control, $elt);                    
                    var $menu = $(options.menu, $elt);                    

                    $elt.data('dropMenu', _.merge(options, {
                        $control : $control,
                        $menu : $menu
                    }));

                    $menu.hide();

                    $control.click(function(e){
                        e.preventDefault();
                        self._toggle($elt);
                    });

                    $(options.menuTarget, $menu).click(function(e){
                        e.preventDefault();
                        self._select($elt, $(this)); 
                    });

                    $elt.trigger('create.dropMenu');
                }
            });
        },

        _toggle : function($elt){
            var self = this;
            var options = $elt.data('dropMenu');
            var $menu = options.$menu;

            if($menu.css('display') === 'none'){
                $menu.slideDown(200, function(){
                    //close menu by clicking outside
                    $(document).on('mouseup.dropMenu', function(e){
                        if (!$menu.is(e.target)  && $menu.has(e.target).length === 0){
                            self._toggle($elt);
                        }
                    });
                });
            } else {
                $(document).off('mouseup.dropMenu');
                $menu.slideUp(200);
            }
        },

        _select : function($elt, $target){ 
            var options = $elt.data('dropMenu');
            var $menu = options.$menu;
            var $control = options.$control;
            var value = $target.text();
            $(options.menuTarget, $menu).removeClass(options.activeClass);
            $target.addClass(options.activeClass);
            
            if(options.action === 'replace'){
                $control.text(value);
            }
            this._toggle($elt);

            $elt.trigger('selected.dropMenu', [$target, value]);
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
