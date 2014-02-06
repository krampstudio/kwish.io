define(['jquery', 'lodash'], function($, _){
    'use strict';

    var resultContainerTmpl = _.template(
        '<div class="searchfield-result"></div>'
    );

    var resultItemTmpl = _.template(
        '<div data-asin="${asin}">' +
            '<p>${title}</p>' +
            '<div class="actions">' +
                '<button class="small great">Add to klist</button>' +
            '</div>' +
            '<a href="${url}" target="_blank">' +
                '<img class="thumb" src="${thumb}" alt="amazon" />' +
            '</a>' +
        '</div>'
    );

    var defaults = {
//      parent: 'selector',
        minLength: 3,
        delay: 300,
        width: '450px',
        data: function(cb){
            cb({});
        }
    };

    /**
     * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
     * @exports components/searchField
     * @example $('container').searchField();
     */
    var searchField = {


        /**
         * Plugin initialisation
         * @public
         * @param {Object} options - the plugin options
         * @returns {jQueryElement} for chaining
         * @fires searchField#create.searchField
         */
        init : function(options){
            var self = searchField;
            
            options = _.defaults(options || {}, defaults);

            return this.each(function(){
                var $elt = $(this);
                if(!$elt.data('searchField')){

                    var running = false;   
                    var loadData = function loadData(){
                        if(running === false){
                            running = true;
                            setTimeout(function(){
                                options.data(function(results){
                                    self._setResultItems($elt, results);                                    
                                    running = false;                              
                                });
                            }, options.delay);
                        }
                    };
                    var $parent = (options.parent) ? $(options.parent) : $elt.parent();

                    //create result list container
                    options.$container = $(resultContainerTmpl()).appendTo($parent);
                    

     
                    //set style relative to the field
                    var position = $elt.position();
                    options.$container.css({
                        left:  position.left,
                        width: options.width || $elt.width()
                    });

                    $elt.data('searchField', options);
                    
                    $elt.on('keyup', function(e){
                        var value = $elt.val();
                        if(value.length >= options.minLength){
                            loadData();
                        }
                    });
                      
                    /**
                     * The searchField is created
                     * @event searchField#create.searchField
                     */    
                    $elt.trigger('create.searchField');
                }
            });
        },
        
        _setResultItems: function($elt, results){
            var options = $elt.data('searchField');
            _.forEach(results.items, function(item){
                options.$container.append(resultItemTmpl(item));
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
                var data = $elt.data('searchField');
                    
                $elt.off('.searchField');
            });
        }
    };

    //register the plugin to jQuery
    $.fn.searchField = function(method) {
        if (_.isFunction(searchField[method])){
            if(/^_/.test(method)){
                $.error('Trying to call a private method : ' + method);
            } else {
                return searchField[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        } else if ( typeof method === 'object' || ! method ) {
            return searchField.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };
});
