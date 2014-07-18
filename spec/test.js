var chai           = require('chai');
var chaiAsPromised = require('chai-as-promised');
var rest           = require('../restling');
var _              = require('lodash');

chai.should();
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

  it('should return a fulfilled promise',function(){
    return rest.get('http://google.com').should.eventually.be.fulfilled;
  });

  it('should return a rejected promise',function(){
    return rest.get('http://goodasdasdsadasgle.com').should.eventually.be.rejectedWith(Error);
  });
});
