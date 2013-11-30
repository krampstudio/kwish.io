var redis = require('redis');
/**
 * prepare the test by inseting data
 */
exports.prepare = function preparetest(conf){
    var client = redis.createClient(conf.port, conf.host);
    if(conf.auth){
        client.auth(conf.auth);
    }
    client.select(conf.db);
    
    client.on('error', function(err){
        console.error(err);
    });

    client.multi()
        .flushdb()
        .hmset('user:krampstudio', {
            fname: 'bertrand',
            lname: 'chevrier',
            email: 'chevrier.bertrand@gmail.com'
        })
        .sadd('userklist:krampstudio', 'ditasbirth')
        .sadd('userklist:krampstudio', 'ditas1birthday')
        .sadd('userklist:krampstudio', 'ditas2birthday')
        .hmset('klist:ditasbirth', {
             title: "dita's birth wish list",
             desc: "to welcome dita in our family we still need a few thing"
        })
        .set('kitemid', 0)
        .incr('kitemid')
        .hmset('kitem:1', {
             title: "Bed",
             desc: "a cut baby bed",
             price: 200
        })
        .incr('kitemid')
        .hmset('kitem:2', {
             title: "toys",
             desc: "some awesome toys",
             price: 20
        })
        .zadd('klistitem:ditasbirth', 1, 1)
        .zadd('klistitem:ditasbirth', 2, 2)
        .exec(function(errors, replies){
            if(errors && errors.length > 0){
                console.error(errors);
            }
            console.log('quit');
            client.quit();
        });
};

