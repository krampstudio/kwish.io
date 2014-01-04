//load the configuration
require(['config'], function(){
    'use strict';

    //main setup
    require(['jquery', 'core/nav', 'components/navbar'], function($, nav){
        
        //set up the ajax navigation
        nav.setup();

        //set up the nav bar component
        $('nav').navbar();
    });
});
