define(['jquery', 'lodash', 'core/nav', 'core/form', 'core/session'], function($, _, nav, form, session){
    'use strict';

    var $navbar = $('nav');

    var loginController = {

        dispatch : function(){
            this._setUpLoginForm();
        },
        
        _setUpLoginForm : function(){
            var self = this;
            var $loginForm = $('#login-form');
            form.setUp($loginForm, function(data){
                self._login(data);
            });
        },

        _login : function(data){
            var self = this;
            $.post('/auth-local', data, function(res){
                var auth = res.auth && res.auth === true;
                if(auth){
                    session.set('login', res.user.login);
                    session.set('token', res.user.token);
                }
                
                $navbar.trigger('update.navbar');
                
                if(auth){
                    nav.open('klistboard');                    
                }

            }, 'json');
        }
    };

    return loginController;
});
