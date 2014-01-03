var conf = require('../config/confLoader').init();
var logger = require('../lib/logFactory').init();
var redisCF = require('../lib/redisClientFactory');
redisCF.init(conf.get('store').redis);

exports.userProviderTest = {

    setUp : function(done){
        this.logins = ['krampstudio', 'jdoe'];
        this.users = [{ 
            fname: "bertrand",
            lname: "chevrier",
            email: "chevrier.bertrand@gmail.com"
        }, {
            fname: "John",
            lname: "Doe",
            email: "jdoe@anonymous.com",
            passwd: "jdoe123"
        }];

        this.token = '8f8fa3c3-4464-4094-bf64-2b7e3d420802';

        done();
    },

    testProviderStruct : function(test){
        test.expect(9);

        var userProvider = require('../lib/providers/user');

        test.ok(typeof userProvider !== undefined);
        test.ok(typeof userProvider.get  === 'function');
        test.ok(typeof userProvider.save  === 'function');
        test.ok(typeof userProvider.loginExists  === 'function');
        test.ok(typeof userProvider.auth  === 'function');
        test.ok(typeof userProvider.getToken  === 'function');
        test.ok(typeof userProvider.checkToken  === 'function');
        test.ok(typeof userProvider.createToken  === 'function');
        test.ok(typeof userProvider.removeToken  === 'function');
        test.done();
    },

    testGetUser : function(test){
        test.expect(2);

        var self = this;
        var userProvider = require('../lib/providers/user');
        userProvider.get(this.logins[0], function(err, user){
            test.equal(err, null);
            test.deepEqual(user, self.users[0]);

            test.done();
        });
    },
    
    testLoginExists : function(test){
        test.expect(2);

        var userProvider = require('../lib/providers/user');
        userProvider.loginExists(this.logins[0], function(err, exists){
            test.equal(err, null);
            test.strictEqual(exists, true);

            test.done();
        });
    },

    testLoginNotExists : function(test){
        test.expect(2);

        var userProvider = require('../lib/providers/user');
        userProvider.loginExists('foob', function(err, exists){
            test.equal(err, null);
            test.strictEqual(exists, false);

            test.done();
        });
    },
    
    testSaveUser : function(test){
        test.expect(4);

        var self = this;
        var userProvider = require('../lib/providers/user');

        userProvider.save(this.logins[1], this.users[1], function(err, inserted){
            test.equal(err, null);
            test.ok(inserted === true);

            userProvider._get(self.logins[1], function(err, user){
                test.equal(err, null);
                test.deepEqual(user, self.users[1]);

                test.done();
            });
        });
    },

    testAuth : function(test){
        test.expect(2);
        var self = this;
        var userProvider = require('../lib/providers/user');
        userProvider.auth(this.logins[1], this.users[1].passwd,  function(err, auth){
            test.equal(err, null);
            test.ok(auth === true);
            test.done();
        });
    },

    testAuthWrongPasswd : function(test){
        test.expect(2);
        var self = this;
        var userProvider = require('../lib/providers/user');
        userProvider.auth(this.logins[1], 'bar',  function(err, auth){
            test.equal(err, null);
            test.ok(auth === false);

            test.done();
        });
    },
   
    testGetToken : function(test){
        test.expect(3);
        
        var self = this;
        var userProvider = require('../lib/providers/user');
        userProvider.getToken(this.logins[0], function(err, token){
            test.equal(err, null);
            test.ok(token !== null);
            test.equal(token, self.token);

            test.done();
        });
    },

    testCheckToken : function(test){
        test.expect(2);
        
        var self = this;
        var userProvider = require('../lib/providers/user');
        userProvider.checkToken(this.logins[0], this.token, function(err, valid){
            test.equal(err, null);
            test.strictEqual(valid, true);

            test.done();
        });
    },

    testCreateToken : function(test){
        test.expect(5);        

        var self = this;
        var userProvider = require('../lib/providers/user');
        userProvider.createToken(this.logins[1], function(err, token){
            test.equal(err, null);
            test.ok(token !== false);
            userProvider.getToken(self.logins[1], function(err, gotToken){
                test.equal(err, null);
                test.ok(gotToken !== null);
                test.equal(token, gotToken);

                test.done();
            });
        });
    },

    testRemoveToken : function(test){
        test.expect(6);        

        var self = this;
        var userProvider = require('../lib/providers/user');
        var login = this.logins[1];

        //check the token exists 
        userProvider.getToken(login, function(err, gotToken){
            test.equal(err, null);
            test.ok(gotToken !== null);

            //remove it
            userProvider.removeToken(login, function(err, removed){
                test.equal(err, null);
                test.ok(removed === true);

                //check the token is removed
                userProvider.getToken(login, function(err, rmToken){
                    test.equal(err, null);
                    test.ok(rmToken === null);

                    test.done();
                });
            });
        });
    },
    
    testDelUser : function(test){
        test.expect(4);

        var self = this;
        var userProvider = require('../lib/providers/user');
        userProvider.get(this.logins[1], function(err, user){
            userProvider.del(self.logins[1], function(err, removed){
                test.equal(err, null);
                test.ok(removed === true);

                userProvider.get(self.logins[1], function(err, user){
                    test.equal(err, null);
                    test.strictEqual(user, null);
                
                    redisCF.exit();

                    test.done();
                });
            });
        });
    }
};
