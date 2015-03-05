'use strict';

var _ = require('lodash');
var restler = require('restler');
var Promise = require('bluebird');

var methods = ['request', 'get', 'post', 'put', 'del', 'head', 'patch', 'json', 'postJson', 'putJson'];


// Function that generate the restler wrapper for all methods from restler to return promise
_.forEach(methods, function(verb){

  exports[verb] = function (args){
    var self = this;
    var request = restler[verb].apply(self, arguments);

    return new Promise(function(resolve, reject) {
      request
        .on('success', function(data, response) {
          resolve({'data': data, 'response': response});
        })
        .on('fail', function(data, response) {
          var url = request.url.href,
            method = verb.toUpperCase(),
            errorMessage = 'Cannot ' + method + ' ' + url,
            error = new Error(errorMessage);

          error.statusCode = response.statusCode;
          error.response = response;
          error.data = data;

          reject(error);
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
    return functionByMethod(myRequest);
  });
}

function wrapToObject(myRequests){
  return _.mapValues(myRequests, function(myRequest){
    return functionByMethod(myRequest);
  });
}

function functionByMethod(myRequest) {
  if (_.has(myRequest, 'options') && _.has(myRequest.options, 'method')) {
    return exports.request(myRequest.url, myRequest.options);
  }
  return exports.get(myRequest.url, myRequest.options);
};

