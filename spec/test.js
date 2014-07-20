var rest           = require('../restling'),
    chai           = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    nock           = require('nock');

chai.use(chaiAsPromised);
chai.should();

nock('http://www.google.com')
  .get('/')
  .times(10)
  .reply(200, 'Any response.');

var methods = ['request', 'get', 'post', 'put', 'del',
  'head', 'patch', 'json', 'postJson', 'putJson',
  'parallelGet'];

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

describe('Requests', function(){

  it('should return a fulfilled promise', function(){
    return rest.get('http://google.com').should.eventually.be.fulfilled;
  });

  it('should return a rejected promise', function(){
    return rest.get('http://goodasdasdsadasgle.com').should.eventually.be.rejectedWith(Error);
  });
});

describe('Parallel requests passing a object', function(){
  var results;
  rest.parallelGet({'one':{'url':'http://www.google.com'}, 'two':{'url':'http://googldasdadase.com'}}, function(err, result){
    results = result;
  });

  it('should return a object', function(){
    results.should.exist.and.be.a('object');
  });

  it('should return a object with properties "one" and "two"', function() {
    results.should.have.property('one');
    results.should.have.property('two');
  });

  it('should return a object with property "one" being succeeded object', function() {
    results.one.should.have.property('data');
    results.one.should.have.property('response');
  });

  it('should return a object with property "two" being a error object', function() {
    results.two.should.have.property('message');
    results.two.should.have.property('code');
  });
});

describe('Parallel requests passing a array', function(){
  var results;
  rest.parallelGet([{'url':'http://www.google.com'}, {'url':'http://googldasdadase.com'}], function(err, result){
    results = result;
  });

  it('should return a array', function(){
    results.should.exist.and.be.a('array');
  });

  it('should return a array with length 2', function() {
    results.should.exist.and.have.length(2);
  });

  it('should return a array with index 0 a being succeeded object', function() {
    results[0].should.exist;
    results[0].should.have.property('data');
    results[0].should.have.property('response');
  });

  it('should return a array with index 1 being a error object', function() {
    results[1].should.exist;
    results[1].should.have.property('message');
    results[1].should.have.property('code');
  });
});