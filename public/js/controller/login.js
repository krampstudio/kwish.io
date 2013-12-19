define(['jquery', 'lodash', 'ui/nav', 'ui/form'], function($, _, Nav, Form){
    'use strict';

    var loginController = {

        dispatch : function(){
            this._setUpLoginForm();
        },
        
        _setUpLoginForm : function(){
            var $loginForm = $('#login-form');
            Form.setUp($loginForm, this._login);
        },

        _login : function(data){
            $.post('/auth-local', data, function(res){
                if(res.auth && res.auth === true){
                    Nav.open('klistboard', false);
                } else {
                    alert('wrong');
                }
            }, 'json');
        }
    };

    return loginController;
});
