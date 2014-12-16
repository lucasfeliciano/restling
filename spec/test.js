var rest           = require('../restling'),
  chai           = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  nock           = require('nock');

chai.use(chaiAsPromised);
chai.should();

nock('http://www.google.com')
  .get('/')
  .times(20)
  .reply(200, 'Any response.');

var methods = ['request', 'get', 'post', 'put', 'del',
  'head', 'patch', 'json', 'postJson', 'putJson',
  'settleAsync'];

describe('Module', function(){
  it('should be a object',function(){
    rest.should.be.a('object');
  });

  it('should have all methods', function(){
    methods.forEach(function(method){
      rest.should.have.property(method);
    });
  });
});

describe('Request Success', function(){
  var result;
  result = rest.get('http://www.google.com');

  it('should return a fulfilled promise with a object and property data', function(){
    return result.should.eventually.be.fulfilled.a('object').and.have.property('data');
  });
});

describe('Request Error', function(){
  var result;
  result = rest.get('http://goodasdasdsadasgle.com');

  it('should return a rejected promise with a error object', function(){
    return result.should.eventually.be.rejectedWith(Error);
  });
});

describe('Settle requests passing a object', function(){
  var result;
  result = rest.settleAsync({'one':{'url':'http://www.google.com'}, 'two':{'url':'http://googldasdadase.com'}});

  it('should return a promise and when resolved must be object', function(){
    result.should.exist.and.be.a('object');
    return result.should.eventually.be.fulfilled.a('object');
  });

  it('should have property "one" being succeeded object', function() {
    return result.should.eventually.have.property('one').and.have.property('data');
  });

  it('should have property "two" being a error object', function() {
    return result.should.eventually.have.property('two').and.have.property('code');
  });
});

describe('Settle requests passing a array', function(){
  var result;
  result = rest.settleAsync([{'url':'http://www.google.com'}, {'url':'http://googldasdadase.com'}]);

  it('should return a promise and when resolved must be array with length 2', function(){
    result.should.exist.and.be.a('object');
    return result.should.eventually.be.fulfilled.a('array').and.have.length(2);
  });

  it('should return a promise with a array and in the index 0 a succeeded object', function() {
    return result.should.eventually.be.fulfilled.and.have.property('0').a('object').and.have.property('data');
  });

  it('should return a promise with a array and in the index 1 a error object', function() {
    return result.should.eventually.be.fulfilled.and.have.property('1').a('object').and.have.property('code');
  })
});

describe('allAsync passing a array with one wrong url address', function(){
  var result;
  result = rest.allAsync([{'url':'http://www.google.com'}, {'url':'http://googldasdadase.com'}]);

  it('should return a rejected promise with error ENOTFOUND', function(){
    result.should.exist.and.be.a('object');
    return result.should.eventually.be.rejected.and.have.property('message', 'getaddrinfo ENOTFOUND');
  });
});

describe('allAsync passing a array with two succeeded url address ', function(){
  var result;
  result = rest.allAsync([{'url':'http://www.google.com'}, {'url':'http://www.google.com'}]);

  it('should return a fulfilled promise with a array and in the index 0 a succeeded object', function() {
    return result.should.eventually.be.fulfilled.and.have.property('0').a('object').and.have.property('data');
  });

  it('should return a fulfilled promise with a array and in the index 1 a succeeded object', function() {
    return result.should.eventually.be.fulfilled.and.have.property('1').a('object').and.have.property('data');
  })
});

describe('allAsync passing a object with one wrong url address', function(){
  var result;
  result = rest.allAsync({'one':{'url':'http://www.google.com'}, 'two':{'url':'http://googldasdadase.com'}});

  it('should return a rejected promise with error ENOTFOUND', function(){
    result.should.exist.and.be.a('object');
    return result.should.eventually.be.rejected.and.have.property('message', 'getaddrinfo ENOTFOUND');
  });
});

describe('allAsync passing a object with two succeeded url address ', function(){
  var result;
  result = rest.allAsync({'one':{'url':'http://www.google.com'}, 'two':{'url':'http://www.google.com'}});

  it('should return a fulfilled promise', function(){
    result.should.exist.and.be.a('object');
    return result.should.eventually.be.fulfilled.a('object');
  });

  it('should have property "one" being succeeded object', function() {
    return result.should.eventually.have.property('one').and.have.property('data');
  });

  it('should have property "two" being a error object', function() {
    return result.should.eventually.have.property('two').and.have.property('data');
  });
});
