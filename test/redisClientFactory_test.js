var conf = require('../config/confLoader').init();
var logger = require('../lib/logFactory').init();

exports.redisClientFactoryTest = {

    testFactory : function(test){
        test.expect(5);

        var redisCF = require('../lib/redisClientFactory'); 
        var client = redisCF.init(conf.get('store').redis);
        var pool = redisCF.pool;

        test.ok(typeof pool !== undefined);
        test.ok(typeof pool.acquire === 'function');

        test.ok(typeof client !== undefined);
        test.ok(typeof client.select === 'function');

        var clientRef = require('../lib/redisClientFactory').client;
        test.strictEqual(clientRef, client);
        
        test.done();
    }

};
