require.config({
    baseUrl : 'js/',

    config : {
        'core/nav' : {
            'restricted' : ['klistboard'],
            'apiPath'    : '/api'
        }
    },

    paths : {
        'xtag'      : '../lib/x-tag-core/core',
        'jquery'    : '../lib/jquery/jquery',
        'lodash'    : '../lib/lodash/lodash.compat',
        'modernizr' : 'core/mizr',
    },
    shim : {
        'xtag' : { exports : 'xtag' }
    }
});
