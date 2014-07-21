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
exports.parallelGet = function(requests, finalCallback){
  var wrappedRequests;

  wrappedRequests = wrapRequests(requests);
  var d = Q.defer();
  async.parallel(wrappedRequests, function(err, results){
    if(err){
      q.reject(err);
    }
    else {
      var promisesValue;
      if(_.isArray(results)) {
        Q.allSettled(results).then(function(promises){
          promisesValue = _.map(promises, function(promise){
            return getPromiseValue(promise);
          });
          d.resolve(promisesValue);
        });
      }
      else if (_.isObject(results)){
        var keys = _.keys(results);
        var values = _.values(results);

        Q.allSettled(values).then(function(promises){
          values = _.map(promises, function(promise){
            return getPromiseValue(promise);
          });
          d.resolve(_.zipObject(keys, values));
        });
      }
    }
  });
  return d.promise;
};

//Auxilar functions

function wrapRequests(requests) {
  var requestsWrapped;
  if (_.isArray(requests)) {
    requestsWrapped = _.map(requests, function(request){
      return wrapRequestObject(request);
    });
  }
  else if (_.isObject(requests)) {
    requestsWrapped = _.mapValues(requests, function(request){
      return wrapRequestObject(request);
    });
  }
  return requestsWrapped;
}

function wrapRequestObject(request){
  return function(callback){
    callback(null, exports.get(request.url, request.options));
  }
}

function getPromiseValue(promise) {
  var pValue;
  if (promise.state === 'rejected') {
    pValue = promise.reason;
  }
  else if (promise.state === 'fulfilled') {
    pValue = promise.value;
  }
  return pValue;
}
