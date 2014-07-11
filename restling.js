'use strict';
var Q = require('q');
var _ = require('lodash');
var restler = require('restler');

var httpVerbs = ['request', 'get', 'post', 'put', 'del', 'head', 'patch'];

// Function that generate the restler wrapper for all the basic http verbs to return promise
_.forEach(httpVerbs, function(verb){
  exports[verb] = function(url, options){
    var d = Q.defer();
    restler[verb](url, options).on('complete', function(data, response){
      d.resolve({'data': data, 'response':response});
    }).on('error', function(err, response){
      d.reject({'error': err, 'response': response });
    });
    return d.promise;
  };
});
