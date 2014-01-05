//load the configuration
require(['config'], function(){
    'use strict';

    //main setup
    require(['jquery', 'core/nav', 'core/notify', 'components/navbar'], function($, nav, notify){
        
        //set up the ajax navigation
        nav.setup();

        notify.error('error');
        notify.warning('warning');
        notify.info('info');
        notify.failure('failure');
        notify.success('success');

        //set up the nav bar component
        $('nav').navbar();
    });
});
