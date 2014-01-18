define(['jquery', 'lodash'], function($, _){
    'use strict';

    var itemTmpl = _.template(
        '<div class="selectbox-item selectbox-${state}">' +
            '<a href="#">${value}</a>' +
            '<i class="fa fa-delete" />' +
        '</div>'
    );
    var itemAddTmpl = _.template(
        '<div class="selectbox-item adder">' +
            '<i class="fa fa-add" /> Add' +
        '</div>'
    );

    var states = ['selectable', 'selected', 'disabled'];
    var defaults = {
        items : [
            {id: '1', value: 'name 1', state: 'selected'},
            {id: '2', value: 'name 2', state: 'selectable'},
            {id: '3', value: 'name 3', state: 'selectable'}
        ],
        add : function(cb){
            cb({id: '3', value: 'name 3', state: 'selectable'});
        },
        added : function(e, item, $itemElt){
            console.log("added", arguments);
        },
        remove : true,
        removed : function(e, item){
            console.log("moveded", arguments);
        },
        selected : function(e, item, $itemElt){
            console.log("selected", arguments);
        }
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
         * @returns {jQueryElement} for chaining
         */
        init : function(options){
            var self = selectBox;
            options = _.defaults(options || {}, defaults);

            return this.each(function(){
                var $elt = $(this);
                if(!$elt.data('selectBox')){

                    $elt.data('selectBox', options);

                    var addItem = function addItem(item){
                        var $itemElt = self._add($elt, item);
                        $itemElt.on('click', function(e){
                            e.preventDefault();
                            self._select($elt, $(this));
                        });          
                        if(options.remove === true){
                            $('.fa-delete', $itemElt).on('click', function(e){
                                e.preventDefault();
                                self._remove($elt, $(this));
                            });
                        }
                    };

                    _.forEach(options.items, addItem);
         
                    if(_.isFunction(options.add)){
                        var $adder = $(itemAddTmpl()).appendTo($elt);
                        $adder.click(function(e){
                            e.preventDefault();
                            options.add.call($elt, addItem);                                                                        
                        });
                    }

                    /**
                     * @event selectBox#.selectBox
                     */    
                    $elt.on('added.selectBox', options.added);
                    $elt.on('removed.selectBox', options.removed);
                    $elt.on('selected.selectBox', options.selected);

                    $elt.trigger('create.selectBox');
                }
            });
        },

        _add : function($elt, item){
            var $itemElt = $(itemTmpl(item));
            $itemElt.data('selectbox-item', item);
            if($elt.children('.adder').length > 0){
                var $items = $(".selectbox-item:not(.adder)");
                $($items.get($items.length - 1)).after($itemElt);
                $elt.trigger('added.selectBox', [item, $itemElt]);
            } else {
                $itemElt.appendTo($elt);
            }
            return $itemElt;
        },

        _select : function($elt, $itemElt){
            $('.selectbox-item', $elt).removeClass('selectbox-selected').addClass('selectbox-selectable');
            $itemElt.removeClass('selectbox-selectable').addClass('selectbox-selected');
            $elt.trigger('selected.selectBox', [$itemElt.data('selectbox-item'), $itemElt]);
        },

        _remove : function($elt, $itemElt){
            var item = $itemElt.data('selectbox-item');
            $itemElt.remove();
            $elt.trigger('remove.selectBox', [item]);
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
