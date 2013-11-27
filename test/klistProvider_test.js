var conf = require('../config/confLoader').init();
var logger = require('../lib/logFactory').init();
var client = require('../lib/redisClientFactory').init(conf.get('store').redis);

exports.klistProviderTest = {

    setUp : function(done){
        this.login = 'krampstudio';
        done();
    },

    testProviderStruct : function(test){
        test.expect(3);

        var klistProvider = require('../lib/providers/klist');

        test.ok(typeof klistProvider !== undefined);
        test.ok(typeof klistProvider.getUserLists  === 'function');
        test.ok(typeof klistProvider.add  === 'function');

        test.done();
    },

   testGetUserList : function(test){
        test.expect(3);

        var self = this;
        var klistProvider = require('../lib/providers/klist');

        klistProvider.getUserLists(this.login, function(err, lists){
            test.strictEqual(err, null);
            test.equal(lists.length, 3);
            test.ok(lists.indexOf('ditasbirth') > 0);
            client.quit();
            test.done();
        });
    }
};


