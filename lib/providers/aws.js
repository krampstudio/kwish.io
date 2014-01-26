var conf = require('../../config/confLoader').conf;
var aznConf = conf.get('amazon');

var util = require('util');
var traverse = require('traverse');
var OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper(aznConf);

var AwsProvider = {

    search : function(keywords, index, cb){
        index = index || 'All';
        
        opHelper.execute('ItemSearch', {
          'SearchIndex': index,
          'Keywords': keywords,
          'ResponseGroup': 'ItemAttributes,Images'
        }, function(response) {
            var results = {};
            var tree = traverse(response);
            var isValid = tree.get([ "ItemSearchResponse", "Items", "0", "Request", "0", "IsValid", "0"]) === 'True';
            if(!isValid){        
                return cb(new Error('Invalid request to Amazon'));
            }
            var items =  tree.get([ "ItemSearchResponse", "Items", "0", "Item" ]);

            results.count = tree.get([ "ItemSearchResponse", "Items", "0", "TotalResults", "0" ]);
            results.pages = tree.get([ "ItemSearchResponse", "Items", "0", "TotalPages", "0" ]);
            results.items = [];
            
            items.forEach(function(item){
                var itemNode = traverse(item);
                var itemResult = {
                    asin : itemNode.get(["ASIN", "0"]),
                    url : itemNode.get(["DetailPageURL", "0"]),
                    thumb : itemNode.get(["SmallImage", "0", "URL", "0"])
                };
                results.items.push(itemResult);
            });

//            console.log('--------------------'); 
//            console.log(util.inspect(results, {depth: 10}));
        //    console.log('--------------------');
    
            return cb(null, results);
        }, function(err){
            cb(err);
        });
    }
};


// execute(operation, params, callback, onError)
// operation: select from http://docs.aws.amazon.com/AWSECommerceService/latest/DG/SummaryofA2SOperations.html
// params: parameters for operation (optional)
// callback(parsed, raw): callback function handling results. parsed = xml2js parsed response. raw = raw xml response
// onError: function handling errors, otherwise all error messages are printed with console.log()

module.exports = AwsProvider;
