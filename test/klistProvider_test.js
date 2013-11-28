var conf = require('../config/confLoader').init();
var logger = require('../lib/logFactory').init();
var client = require('../lib/redisClientFactory').init(conf.get('store').redis);

exports.klistProviderTest = {

    setUp : function(done){
        this.login = 'krampstudio';
        this.id = 'foolist';
        this.list = {
            title : 'Awesome Foo List',
            desc : 'Really awesome list',
            state: 'public'
        };
        done();
    },

    testProviderStruct : function(test){
        test.expect(6);

        var klistProvider = require('../lib/providers/klist');

        test.ok(typeof klistProvider !== undefined);
        test.ok(typeof klistProvider.getUserLists  === 'function');
        test.ok(typeof klistProvider.save  === 'function');
        test.ok(typeof klistProvider.del  === 'function');
        test.ok(typeof klistProvider.getId  === 'function');
        test.ok(typeof klistProvider.getListItems === 'function'); 
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

            test.done();
        });
    },

   testGetListItems : function(test){
        test.expect(3);

        var self = this;
        var klistProvider = require('../lib/providers/klist');

        klistProvider.getListItems('ditasbirth', function(err, items){
            test.strictEqual(err, null);
            test.equal(items.length, 2);
            test.ok(items.indexOf('2') >= 0);

            test.done();
        });
    },
   
     testSaveList : function(test){
        test.expect(2);

        var self = this;
        var klistProvider = require('../lib/providers/klist');

        klistProvider.save(this.login, this.id, this.list,  function(err, saved){
            test.strictEqual(err, null);
            test.strictEqual(saved, true);
            
            test.done();
        });
    },
    
    testGetId : function(test){
        test.expect(2);

        var self = this;
        var klistProvider = require('../lib/providers/klist');
        klistProvider.getId('Foo List',  function(err, id){
            test.strictEqual(err, null);
            test.equal(id, 'foo-list');
            
            test.done();
        });
    },

    testDelList : function(test){
        test.expect(2);

        var self = this;
        var klistProvider = require('../lib/providers/klist');

        klistProvider.del(this.login, this.id, function(err, removed){
            test.strictEqual(err, null);
            test.strictEqual(removed, true);
            
            client.quit();
            test.done();
        });
    }
};


