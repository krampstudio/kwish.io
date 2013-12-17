define(['jquery', 'lodash'], function($, _){
    'use strict';   
 
    var $container = $('#container');

    return {
        setup : function(){
            var self = this;
            $(document).on('click', "a[href!='#']", function(e){
                e.preventDefault();
                var ref = $(this).attr('href');
                self.open(ref);
            });
        },

        open : function(ref, loadCtrl){
            loadCtrl = loadCtrl || true;
            if(ref){
                var view = 'views/' + ref + '.html';
                var controller = 'controller/' + ref;
                $container.load(view, function(){
                    $container.removeClass($container.prop('class')).addClass(ref);
                    if(loadCtrl === true){
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
