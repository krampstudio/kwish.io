define(['jquery', 'lodash'], function($, _){
    'use strict';

    var itemTmpl = _.template(
        '<div class="selectbox-item selectbox-${state}">' +
            '<a href="#">${value}</a>' +
            '<span class="remover"></span>' +
        '</div>'
    );
    var itemAddTmpl = _.template(
        '<div class="selectbox-item adder">' +
            '<a href="#">Add</a>' +
        '</div>'
    );

    var states = ['selectable', 'selected', 'disabled'];

    var defaults = {
        items : [],
        add : false,
        remove : false
    };

    /**
     * The Advanced Selector component, registered as a jquery plugin
     * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
     * @exports components/selectBox
     * @example $('container').selectBox();
     */
    var selectBox = {


        /**
         * Plugin initialisation
         * @public
         * @param {Object} options - the plugin options
         * @param {Array} options.items - the item list to be displayed, each item must have a value and a state property
         * @param {AddCallback|Boolean} [options.add = false] - the function used to add a new item
         * @param {RmCallback|Boolean} [options.remove = false] -  the function used to remove item
         * @returns {jQueryElement} for chaining
         * @fires selectBox#create.selectBox
         */
        init : function(options){
            var self = selectBox;
            
            options = _.defaults(options || {}, defaults);

            return this.each(function(){
                var $elt = $(this);
                if(!$elt.data('selectBox')){

                    $elt.data('selectBox', options);

                    /**
                     * This function adds an item to the selectBox
                     * @param {Object} item - the item to add
                     */
                    var addItem = function addItem(item){
                        
                        //add the element
                        var $itemElt = self._add($elt, item);
                        
                        //bind select item
                        $itemElt.on('click', function(e){
                            e.preventDefault();
                            self._select($elt, $itemElt);
                        });  
        
                        //bind removal
                        if(_.isFunction(options.remove)){
                            $('.remover', $itemElt).on('click', function(e){
                                e.preventDefault();
                                
                                /**
                                 * Called back by the defined function to remove an item
                                 * @callback RmCallback
                                 * @param  {Function} cb - the callback that will get the confirmed boolean in parameter
                                 */
                                options.remove.call($elt, function(confirmed){
                                    if(confirmed === true){
                                        self._remove($elt, $itemElt);
                                    }
                                });
                            });
                        } else {
                            $('.remover', $itemElt).remove();
                        }
                        
                        //if the state is set to selected
                        if(item.state === 'selected'){
                            self._select($elt, $itemElt);
                        }
                    };

                    //add defined items
                    _.forEach(options.items, addItem);
         
                    //add the adder
                    if(_.isFunction(options.add)){
                        var $adder = $(itemAddTmpl()).appendTo($elt);
                        $adder.click(function(e){
                            e.preventDefault();
                            
                            /**
                             * Called back by the defined function to add an item
                             * @callback AddCallback
                             * @param  {Function} cb - the callback that will get the item in parameter
                             */
                            options.add.call($elt, addItem);                                                                        
                        });
                    }

                    /**
                     * The selectBox is created
                     * @event selectBox#create.selectBox
                     */    
                    $elt.trigger('create.selectBox');
                }
            });
        },

        /**
         * Add an item to the selectBox
         * @private
         * @param {jQueryElement} $elt - the selectBox element
         * @param {Object} item - the item to add   
         * @returns {jQueryElement} $itemElt - the inserted element 
         * @fires selectBox#added.selectBox
         */
        _add : function($elt, item){
            var $itemElt = $(itemTmpl(item));
            $itemElt.data('selectbox-item', item);
            if($elt.children('.adder').length > 0){
                if($elt.find('.selectbox-item').length > 0){
                    var $items = $(".selectbox-item:not(.adder)");
                    $($items.get($items.length - 1)).after($itemElt);
                } else {
                    $itemElt.appendTo($elt);
                }
                
                /**
                 * A new item has been added to the selectBox
                 * @event selectBox#added.selectBox
                 * @param {Object} item - the added item object
                 * @param {jQueryElement} $itemElt - the added item element
                 */    
                $elt.trigger('added.selectBox', [item, $itemElt]);
            } else {
                $itemElt.appendTo($elt);
            }
            return $itemElt;
        },

        /**
         * Select an item (change it's state/css class)
         * @private
         * @param {jQueryElement} $elt - the selectBox element
         * @param {jQueryElement} $itemElt - the item element
         * @fires selectBox#added.selectBox
         */
        _select : function($elt, $itemElt){
        
            //toggle css classes
            $('.selectbox-item', $elt).removeClass('selectbox-selected').addClass('selectbox-selectable');
            $itemElt.removeClass('selectbox-selectable').addClass('selectbox-selected');
            
            /**
             * An item has been marked as selected
             * @event selectBox#selected.selectBox
             * @param {Object} item - the selected item object
             * @param {jQueryElement} $itemElt - the selected item element
             */    
            $elt.trigger('selected.selectBox', [$itemElt.data('selectbox-item'), $itemElt]);
        },

        /**
         * Remove an item 
         * @private
         * @param {jQueryElement} $elt - the selectBox element
         * @param {jQueryElement} $itemElt - the item element
         * @fires selectBox#removed.selectBox
         */
        _remove : function($elt, $itemElt){
            var item = $itemElt.data('selectbox-item');
            $itemElt.remove();
            
             /**
             * An item has been removed
             * @event selectBox#selected.selectBox
             * @param {Object} item - the removed item object
             */    
            $elt.trigger('removed.selectBox', [item]);
        },
            
        /**
         * Plugin desctruction, unbind events
         * @public
         * @returns {jQueryElement} for chaining
         */
        destroy : function(){
            return this.each(function(){
                var $elt = $(this);
                var data = $elt.data('selectBox');
                    
                $elt.off('.selectBox');
            });
        }
    };

    //register the plugin to jQuery
    $.fn.selectBox = function(method) {
        if (_.isFunction(selectBox[method])){
            if(/^_/.test(method)){
                $.error('Trying to call a private method : ' + method);
            } else {
                return selectBox[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        } else if ( typeof method === 'object' || ! method ) {
            return selectBox.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };
});
