var chai   = require('chai');
var should = chai.should();
var chaiAsPromised = require("chai-as-promised");
var rest   = require('../restling');
var _      = require('lodash');

chai.use(chaiAsPromised);

var methods = ['request', 'get', 'post', 'put', 'del',
               'head', 'patch', 'json', 'postJson', 'putJson',
               'parallelGet'];

describe('Module', function(){
  it('should be a object',function(){
    rest.should.be.a('object');
  });

  it('should have all methods', function(){
    _.forEach(methods, function(method){
      rest.should.have.property(method);
    })
  });
});

describe('Requests', function(){
  it('should return promises',function(){
    return rest.get('http://google.com').should.be.fulfilled;
  });

  it('should return promises',function(){
    return rest.get('http://goodasdasdsadasgle.com').should.be.rejectedWith(Error);
  });
});
