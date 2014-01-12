define(['jquery', 'lodash'], function($, _){
    'use strict';

    var defaults = {
        timeout : 10000
    };
    
    var notifier = {
            
        stack : [],
        size  : 3,
        $container : $('#notifs'),
        tmpl : _.template('<div id="msg-${id}" class="msg msg-${type}">${content}</div>'),
        types : ['info', 'success', 'failure', 'warning', 'error'],

        _showing : false,

        add : function(type, content, options){
            var self = this;
            this.stack.push(_.merge({
                    id : new Date().getTime() + '' + this.stack.length,
                    type : type,
                    content : content,
                    status : 'waiting'
                }, 
                _.defaults(options || {}, defaults))
            );
            
            //in case of multiple additions
            setTimeout(function(){
                self.show();
            }, this.size * 10);
        },

        show : function(){
            var self = this;
 
            //how many messages we can show
            var size = this.size - (_.where(this.stack, {status : 'showing'}).length);
            if(size > 0 && this._showing === false){
                this._showing = true;
                _(this.stack)
                    .first(size)
                    .where({status : 'waiting'})
                    .forEach(function(message, index){
                        message.status = 'showing';
                        self.display(message);
                        if(_.isNumber(message.timeout) && message.timeout > 0){
                            setTimeout(function(){
                                self.close(message);
                            }, message.timeout + (index * 100));
                        }  
                    });
                this._showing = false;
            }
        },

        hide : function(){
            _.remove(this.stack, function(message){
                return message.status === 'closed';
            });
            this.show();
        },
    
        display : function(message){
            this.$container.append(this.tmpl(message));
        },

        close : function(message){
            
            $('#msg-' + message.id, this.$container).slideUp(function(){
                $(this).remove();
            });
            message.status = 'closed';
            this.hide();
        }
    };

    /**
     * The notify object that allows you to create notification of a given type
     * @exports core/notify
     * @example notify.error('This is a permanent error message', {timeout: -1, closable : true});
     */
    var notify = {

        /**
         * Setup the notifier
         * @param {Object} options - the notifier options
         * @param {Number} [size = 3] - the stack size
         * @param {jQueryElement} [$container = $('#notifs')] - the element that will contain the messages
         * @param {Function} [tmpl] - a compiled template (ie lodash template) with the notification structure
         * @param {Array} [types] - the available notifications types ['info', 'success', 'failure', 'warning', 'error']
         */
        setup : function(options){
            notifier = _.merge(notifier, options);
        }
    };

    _.forEach(notifier.types, function(type){
        notify[type] = _.bind(notifier.add, notifier, type);
    });

    return notify; 
});
