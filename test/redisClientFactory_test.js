var logger = require('../lib/logFactory').init();

exports.redisClientFactoryTest = {

    testFactory : function(test){
        test.expect(3);

        var client = require('../lib/redisClientFactory').init();
        test.ok(typeof client !== undefined);
        test.ok(typeof client.select === 'function');

        var clientRef = require('../lib/redisClientFactory').client;
        test.strictEqual(clientRef, client);
        

        test.done();
    }

};
