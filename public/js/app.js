//load the configuration
require(['config'], function(){
    'use strict';

    //load components first
    require(['components/xview']);

    //main setup
    require(['jquery', 'core/nav', 'core/notify', 'components/navbar'], function($, nav, notify){

        //set up the ajax navigation
        nav.setup();

        //set up the nav bar component
        $('nav').navbar();
    });
});
