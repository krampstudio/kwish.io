define(['jquery', 'lodash', 'ui/history'], function($, _, history){
    'use strict';   
 
    var $container = $('#container');

    return {
        setup : function(){
            var self = this;
            var paths = document.location.pathname.split('/');
            var module = (paths.length > 0) ? paths[paths.length - 1].replace('.html', '') : '';


            $(document).on('click', "a[href!='#']", function(e){
                e.preventDefault();
                var ref = $(this).attr('href');
                self.open(ref);
            });
            history.popState(function(state, url){
                self._open(state.module, state.dispatch);
            });

            if(module !== '' && module !== 'home'){
                self.open(module);
            } else {
                history.pushState({ module : 'home', dispatch : false } , 'Home', 'home.html'); 
            }
        },

        open : function(ref, dispatch){
            if(dispatch === undefined){
                dispatch = true;
            }
            history.pushState({ module : ref, dispatch : dispatch } , ref, ref + '.html'); 
            this._open(ref, dispatch);
        },

        _open : function(ref, dispatch){
            if(ref){
                var view = 'views/' + ref + '.html';
                var controller = 'controller/' + ref;
                $container.load(view, function(){
                      
                    $container.removeClass($container.prop('class')).addClass(ref);
                    if(dispatch === true){
                        require([controller], function(Controller){
                            if(Controller && _.isFunction(Controller.dispatch)){
                                Controller.dispatch();
                            }
                        });
                    }
                });
            }
        }
    };
});
