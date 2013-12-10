
var redis = require('redis');
var _ = require('lodash');

/**
 * prepare the test by inseting data
 */
function preparetest(conf, cb){
    var client = redis.createClient(conf.port, conf.host);
    if(conf.auth){
        client.auth(conf.auth);
    }
    client.select(conf.db);
    
    client.on('error', function(err){
        cb(err);
    });

    client.multi()
        .flushdb()
        .hmset('user:krampstudio', {
            fname: 'bertrand',
            lname: 'chevrier',
            email: 'chevrier.bertrand@gmail.com'
        })
        .set('token:krampstudio', '8f8fa3c3-4464-4094-bf64-2b7e3d420802')
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
                cb(errors[0]);
            }
            client.quit();
            cb();
        });
}

exports.run = function(cb){
    var conf = require('../../config/confLoader').init();
    preparetest(conf.get('store').redis, cb);
};
