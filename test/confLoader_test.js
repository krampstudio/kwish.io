'use strict';


exports.confLoaderTest = {
    setUp: function(done) {

        this.config = require('../config/config.json'); 
        done();
    },

    testFactory : function(test){
        test.expect(3);

        var conf = require('../config/confLoader').init();
        test.ok(typeof conf !== undefined);
        test.ok(typeof conf.get === 'function');

        var confRef = require('../config/confLoader').conf;
        test.strictEqual(confRef, conf);

        test.done();
    },

    testValues : function(test){
        test.expect(2);

        var conf = require('../config/confLoader').conf;
        test.equal(conf.get('server').address, this.config.server.address);
        test.equal(conf.get('server').port, this.config.server.port);

        test.done();
    }
};
