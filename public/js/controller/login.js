define(['jquery', 'lodash', 'ui/nav', 'ui/form'], function($, _, nav, form){
    'use strict';

    var $loginMenu = $('.login-menu');
    var $logoutMenu = $('.logout-menu');

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
                    self._updateNavBar(data.login);
                    nav.open('klistboard', false);
                } else {
                    self._updateNavBar(false);
                    alert('wrong');
                }
            }, 'json');
        },

        _updateNavBar : function(login){
            if(login){
                $loginMenu.hide();        
                $logoutMenu.show(); 
                $logoutMenu.find('li:first-child > a').text(login);       
            } else {
                $loginMenu.show(); 
                $logoutMenu.hide(); 
                $logoutMenu.find('li:first-child > a').text('');       
            }
        }
    };

    return loginController;
});
