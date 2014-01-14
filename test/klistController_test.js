var conf = require('../config/confLoader').init();
var logger = require('../lib/logFactory').init();
var redisCF = require('../lib/redisClientFactory');
redisCF.init(conf.get('store').redis);
var _ = require('lodash');

exports.klistControllererTest = {

    setUp : function(done){
        this.req = {
            _headers : {},
            params : {},
            accepts : function(mimeType){
                return mimeType.indexOf('json') > -1;
            },    
            header : function(key){
                return this._headers[key];
            }
        }; 
        this.res = {
            _cb : null,
            _json : null,
            json : function(obj){
                this._json = obj;
                if(typeof this._cb === 'function'){
                    this._cb();
                }
            },
            onSend : function(cb){
                this._cb = cb;
            }
        };

        done();
    },

    testControllerStruct : function(test){
        test.expect(2);
    
        var controller = require('../controllers/klist');
        test.ok(typeof controller === 'object');
        test.ok(typeof controller.get === 'function');

        test.done();
    },

    testGet : function(test){
        test.expect(3);
                
        var controller = require('../controllers/klist');
        var req = _.clone(this.req);
        var res = _.clone(this.res);
        var next = function(){
            test.ok(false, "Next should never been called");
        };

        req.params.id = 'ditasbirth';
        req._headers.XLogin = 'krampstudio';
        res.onSend(function(){
            test.notStrictEqual(res._json, null, "The response content should not be null");
            test.ok(typeof res._json.error === 'undefined', "The response should not contains an error");
            test.deepEqual(res._json, { 
                title: 'dita\'s birth wish list',
                desc: 'to welcome dita in our family we still need a few thing',
                category: 'baby'
            });      
            test.done();
        });
        controller.get(req, res, next);
    },

    testGetLists : function(test){
        test.expect(3);
                
        var controller = require('../controllers/klist');
        var req = _.clone(this.req);
        var res = _.clone(this.res);
        var next = function(){
            test.ok(false, "Next should never been called");
        };

        req._headers.XLogin = 'krampstudio';
        res.onSend(function(){
            test.notStrictEqual(res._json, null, "The response content should not be null");
            test.ok(typeof res._json.error === 'undefined', "The response should not contains an error");
            test.ok(res._json.indexOf('ditasbirth') > -1);       
 
            test.done();
        });
        controller.getLists(req, res, next);
  }
};
