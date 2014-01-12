require.config({
    baseUrl : 'js/',

    config : {
        'core/nav' : {
            'restricted' : ['klistboard'],
            'apiPath'    : '/api'
        }
    },

    paths : {
        'jquery'    : '../lib/jquery/jquery',
        'lodash'    : '../lib/lodash/lodash.compat',
        'modernizr' : 'core/mizr'
    }
});
