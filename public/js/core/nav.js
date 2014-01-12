define(['module', 'jquery', 'lodash', 'core/history', 'core/session', 'core/notify'], 
function(module, $, _, history, session, notify){
    'use strict';   
 
    var restricted = module.config().restricted;
    var $container = $('#container');
    var $loader = $('#loader');

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
                self.open('home', false); 
            }
        },

        open : function(ref, dispatch){
            if(dispatch === undefined){
                dispatch = true;
            }
             
            //check if a token exists
            if(_.contains(restricted, ref) && !_.isString(session.get('token'))){
                notify.failure('You must login before acessing to %s', ref);
                return this.open('login');
            }

            history.pushState({ module : ref, dispatch : dispatch } , ref, ref); 
            this._open(ref, dispatch);
        },

        api : function(url, options, cb){
            var defaults = {
                type : 'GET', 
                dataType : 'json'
            };
            if(session.isset('token')){
                defaults.headers = {
                    'XToken' : session.get('token'),
                    'XLogin' : session.get('login')
                };
            }
            $.ajax(url, _.defaults(options, defaults)).done(function(data){
                cb(data);
            }).fail(function(jqXHR, textStatus, errorThrown){
                notify.failure('An error occurs while retrieving data: %s', errorThrown);
            });
        },

        _open : function(ref, dispatch){
            if(ref){
                var view = 'views/' + ref + '.html';
                var controller = 'controller/' + ref;

                $loader.show();
                $container.empty();
    
                setTimeout(function(){
                    $container.load(view, function(){
                        $loader.hide();      
                        $container.removeClass($container.prop('class')).addClass(ref);
                        if(dispatch === true){
                            require([controller], function(Controller){
                                if(Controller && _.isFunction(Controller.dispatch)){
                                    Controller.dispatch();
                                }
                            });
                        }
                    });
                }, 300);
            }
        }
    };
});
