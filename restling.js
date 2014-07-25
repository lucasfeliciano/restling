'use strict';

var _ = require('lodash');
var restler = require('restler');
var Promise = require('bluebird');

var httpVerbs = ['request', 'get', 'post', 'put', 'del', 'head', 'patch'];
var jsonMethods =['json', 'postJson', 'putJson'];


// Function that generate the restler wrapper for all the basic http verbs to return promise
_.forEach(httpVerbs, function(verb){
  exports[verb] = function (url, options){
    var request = restler[verb](url, options || {});

    return new Promise(function(resolve, reject) {
      request
        .on('complete', function(data, response){
          if (data instanceof Error) {
            reject(data);
          } else {
            resolve({'data': data, 'response':response});
          }
        })
        .on('success', function(data, response) {
          resolve({'data': data, 'response': response});
        })
        .on('fail', function(data, response) {
          resolve({'data': data, 'response': response});
        })
        .on('error', function(err) {
          reject(err);
        })
        .on('abort', function() {
          reject(new Promise.CancellationError());
        })
        .on('timeout', function() {
          reject(new Promise.TimeoutError());
        });
    });
  };
});

// Function that generate the restler wrapper for all the json methods to return promise
_.forEach(jsonMethods, function(verb){
  exports[verb] = function (url, data, options){
    var request = restler[verb](url, data, options || {});

    return new Promise(function(resolve, reject) {
      request
        .on('complete', function(data, response){
          if (data instanceof Error) {
            reject(data);
          } else {
            resolve({'data': data, 'response':response});
          }
        })
        .on('success', function(data, response) {
          resolve({'data': data, 'response': response});
        })
        .on('fail', function(data, response) {
          resolve({'data': data, 'response': response});
        })
        .on('error', function(err) {
          reject(err);
        })
        .on('abort', function() {
          reject(new Promise.CancellationError());
        })
        .on('timeout', function() {
          reject(new Promise.TimeoutError());
        });
    });
  };
});

exports.settleAsync = function(myRequests) {

  var wrapped = wrapToArray(myRequests);
  if (_.isArray(myRequests)) {
    return Promise.settle(wrapped).then(function(settledValues){
      return getSettledValues(settledValues);
    });
  }
  else if (_.isObject(myRequests)) {
    var keys = _.keys(myRequests);

    return Promise.settle(wrapped).then(function(settledValues) {
      var resolved = _.zipObject(keys, getSettledValues(settledValues));
      return  Promise.resolve(resolved);
    });
  }
};

//Function to make parallel async http requests.
exports.allAsync = function (myRequests) {
  if (_.isArray(myRequests)) {
    return Promise.all(wrapToArray(myRequests));
  }
  else if (_.isObject(myRequests)) {
    return Promise.props(wrapToObject(myRequests));
  }
};

// Aux Functions

function getSettledValues(settledValues) {
  return _.map(settledValues, function(settledValue){
    return getPromiseValue(settledValue);
  });
}
function getPromiseValue(promise) {
  var promiseValue;

  if(promise.isFulfilled()){
    promiseValue = promise.value();
  } else if (promise.isRejected()){
    promiseValue = promise.reason();
  }
  return promiseValue;
}

function wrapToArray(myRequests) {
    return _.map(myRequests, function(myRequest){
      return exports.get(myRequest.url, myRequest.options);
    });
}

function wrapToObject(myRequests){
  return _.mapValues(myRequests, function(myRequest){
    return exports.get(myRequest.url, myRequest.options);
  })
};
