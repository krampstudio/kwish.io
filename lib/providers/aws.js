var conf = require('../../config/confLoader').conf;
var _ = require('lodash');
var aznConf = conf.get('amazon');
var traverse = require('traverse');
var OperationHelper = require('apac').OperationHelper;

//the paths used to traverse the aws JSON results
var awsResultPaths = _.transform({
    valid   : 'ItemSearchResponse/Items/0/Request/0/IsValid/0',
    items   : 'ItemSearchResponse/Items/0/Item',
    total   : 'ItemSearchResponse/Items/0/TotalResults/0',
    pages   : 'ItemSearchResponse/Items/0/TotalPages/0',
    asin    : 'ASIN/0',
    url     : 'DetailPageURL/0',
    thumb   : 'SmallImage/0/URL/0',
    title   : 'ItemAttributes/0/Title/0',
    binding : 'ItemAttributes/0/Binding/0', 
    amount  : 'ItemAttributes/0/ListPrice/0/Amount/0',
    currency: 'ItemAttributes/0/ListPrice/0/CurrencyCode/0'
}, function(result, value, key){
   result[key] = value.split('/');
});

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
            var isValid = tree.get(awsResultPaths.valid) === 'True';
            if(!isValid){        
                return cb(new Error('Invalid request to Amazon'));
            }
            var items =  tree.get(awsResultPaths.items);
            results.total = tree.get(awsResultPaths.total);
            results.pages = tree.get(awsResultPaths.pages);
            results.items = [];
            
            items.forEach(function(item){
                var itemNode = traverse(item);
                var itemResult = {
                    asin : itemNode.get(awsResultPaths.asin),
                    url : itemNode.get(awsResultPaths.url),
                    thumb : itemNode.get(awsResultPaths.thumb),
                    title : itemNode.get(awsResultPaths.title),
                    binding : itemNode.get(awsResultPaths.binding),
                    price : {     
                            amount  : itemNode.get(awsResultPaths.amount),
                            currency: itemNode.get(awsResultPaths.currency)
                    }
                };
                results.items.push(itemResult);
            });

            return cb(null, results);
        }, function(err){
            cb(err);
        });
    }
};



module.exports = AwsProvider;
