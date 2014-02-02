var conf = require('../config/confLoader').init();
var logger = require('../lib/logFactory').init();
var _ = require('lodash');

exports.awsControllererTest = {

    setUp : function(done){

        //deep mocks 
        var loadModule = require('./loadModule').loadModule;
        var awsModule = loadModule('./controllers/aws.js', {
            '../lib/providers/aws' : {
                search : function(keywords, index, cb){
                   cb(null, {
                        total : 2,
                        pages : 1,
                        items : [{
                            asin : "2266020978",
                        }, {
                            asin : "2266020978",
                        }]
                    });
                }
            }
         });
        this.controller = awsModule.awsController;

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
    
        var controller = require('../controllers/aws');
        test.ok(typeof controller === 'object');
        test.ok(typeof controller.search === 'function');

        test.done();
    },

    testBasicSearch : function(test){
        test.expect(3);
                
        var req = _.clone(this.req);
        var res = _.clone(this.res);
        var next = function(){
            test.ok(false, "Next should never been called");
        };

        req.params.pattern = 'Elric des Dragons';
        res.onSend(function(){
            test.notStrictEqual(res._json, null, "The response content should not be null");
            test.ok(typeof res._json.error === 'undefined', "The response should not contains an error");
            test.equal(res._json.total, 2);
            test.done();
        });
        this.controller.search(req, res, next);
    },

    testFailingSearch : function(test){
        test.expect(1);
                
        var req = _.clone(this.req);
        var res = _.clone(this.res);
        var next = function(){
            test.ok(true, "Next must been called");
            test.done();
        };
        this.controller.search(req, res, next);
    }


};
