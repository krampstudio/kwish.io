var conf = require('../config/confLoader').init();
var logger = require('../lib/logFactory').init();
var client = require('../lib/redisClientFactory').init(conf.get('store').redis);

exports.userProviderTest = {
    setUp : function(done){
        this.login = 'krampstudio';
        this.user ={ 
            fname: "bertrand",
            lname: "chevrier",
            email: "chevrier.bertrand@gmail.com"
        };
        done();
    },

    testProviderStruct : function(test){
        test.expect(5);

        var userProvider = require('../lib/providers/user');

        test.ok(typeof userProvider !== undefined);
        test.ok(typeof userProvider.get  === 'function');
        test.ok(typeof userProvider.save  === 'function');
        test.ok(typeof userProvider.loginExists  === 'function');
        test.ok(typeof userProvider.auth  === 'function');

        test.done();
    },

    testGetUser : function(test){
        test.expect(2);

        var self = this;
        var userProvider = require('../lib/providers/user');
        userProvider.get(this.login, function(err, user){
            test.equal(err, null);
            test.deepEqual(user, self.user);

            test.done();
        });
    },

    testSaveUser : function(test){
        test.expect(4);

        var self = this;
        var userProvider = require('../lib/providers/user');
        var newUser = {
            fname: "John",
            lname: "Doe",
            email: "jdoe@anonymous.com"
        };
        userProvider.save('jdoe', newUser, function(err, inserted){
            test.equal(err, null);
            test.ok(inserted === true);

            userProvider.get('jdoe', function(err, user){
                test.equal(err, null);
                test.deepEqual(user, newUser);

                test.done();
            });
        });
    },

   testDelUser : function(test){
        test.expect(4);

        var self = this;
        var userProvider = require('../lib/providers/user');
        userProvider.get('jdoe', function(err, user){
            userProvider.del('jdoe', function(err, removed){
                test.equal(err, null);
                test.ok(removed === true);

                userProvider.get('jdoe', function(err, user){
                    test.equal(err, null);
                    test.strictEqual(user, null);

                    client.quit();
                    test.done();
                });
            });
        });
    }
};


