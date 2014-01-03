define(['jquery', 'lodash', 'ui/nav', 'ui/form', 'ui/session'], function($, _, nav, form, session){
    'use strict';

    var $loginMenu = $('.login-menu');
    var $logoutMenu = $('.logout-menu');
    var $logout = $('#logout');

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
                if(res.auth && res.auth === true){

                    session.set('login', res.user.login);
                    session.set('token', res.user.token);

                    self._updateNavBar();

                    nav.open('klistboard', false);
                } else {
                    self._updateNavBar(false);
                }
            }, 'json');
        },

        _updateNavBar : function(){
            var self = this;
            var login = session.get('login');
            if(login && _.isString(login) && !_.isEmpty(login)){
                $loginMenu.hide();        
                $logoutMenu.show().find('li:first-child > a').text(login);    
                $logout.on('click', function(e){
                    e.preventDefault();
                    nav.api('/logout', {}, function(data){
                        session.rm('login');
                        session.rm('token');
                        self._updateNavBar();
                    });
                });
            } else {
                $loginMenu.show(); 
                $logoutMenu.hide().find('li:first-child > a').text('');
                $logout.off('click');
            }
        }
    };

    return loginController;
});
