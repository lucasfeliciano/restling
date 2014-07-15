'use strict';
var Q = require('q');
var _ = require('lodash');
var restler = require('restler');
var async = require('async');

var httpVerbs = ['request', 'get', 'post', 'put', 'del', 'head', 'patch'];
var jsonMethods =['json', 'postJson', 'putJson'];

// Function that generate the restler wrapper for all the basic http verbs to return promise
_.forEach(httpVerbs, function(verb){
  exports[verb] = function(url, options){
    var d = Q.defer();
    restler[verb](url, options).on('complete', function(result, response){
      if (result instanceof Error) {
        d.reject(result)
      } else {
        d.resolve({'data': result, 'response':response});
      }
    }).on('error', function(err){
      d.reject(err);
    }).on('timeout', function(ms){
      d.reject({'name': 'Timeout', 'message':'Timeout after '+ms+'ms'});
    });
    return d.promise;
  };
});

// Function that generate the restler wrapper for all the json methods to return promise
_.forEach(jsonMethods, function(verb){
  exports[verb] = function(url, data, options){
    var d = Q.defer();
    restler[verb](url, data, options).on('complete', function(result, response){
      if (result instanceof Error) {
        d.reject(result)
      } else {
        d.resolve({'data': result, 'response':response});
      }
    }).on('error', function(err){
      d.reject(err);
    }).on('timeout', function(ms){
      d.reject({'name': 'Timeout', 'message':'Timeout after '+ms+'ms'});
    });
    return d.promise;
  };
});

//Function to make parallel async http requests.
exports.parallelGet = function(objs, finalCallback){
  var wrappedObjs = _.map(objs, function(obj){
    return function(callback){
      callback(null, exports.get(obj.url, obj.options));
    }
  });

  async.parallel(wrappedObjs, function(err, results){
    Q.allSettled(results).then(function(promises){
      var promisesValue = _.map(promises, function(promise){
        if(promise.state === 'rejected'){
          return promise.reason;
        }
        else if(promise.state === 'fulfilled'){
          return promise.value;
        }
      });
      finalCallback(err, promisesValue);
    });
  });
};
