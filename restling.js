'use strict';
var Q = require('q');
var restler = require('restler');

exports.get = function(url, params){
  var d = Q.defer();
  restler.get(url, params).on('complete', function(data){
    d.resolve(data);
  }).on('error', function(err){
    d.reject(err);
  });
  return d.promise;
};
