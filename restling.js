'use strict';
var Q = require('q');
var _ = require('lodash');
var restler = require('restler');

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
    }).on('error', function(err, response){
      d.reject({'error': err, 'response': response });
    }).on('timeout', function(ms){
      d.reject({'name': 'timeout', 'message':'Timeout after '+ms+'ms'});
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
    }).on('error', function(err, response){
      d.reject({'error': err, 'response': response });
    }).on('timeout', function(ms){
      d.reject({'name': 'timeout', 'message':'Timeout after '+ms+'ms'});
    });
    return d.promise;
  };
});
