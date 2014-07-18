var chai           = require('chai');
var chaiAsPromised = require('chai-as-promised');
var rest           = require('../restling');
var _              = require('lodash');
var nock           = require('nock');


chai.should();
chai.use(chaiAsPromised);

var successMock = nock('http://myapi.com')
              .get('/')
              .reply(200, 'Any response.');

nock.disableNetConnect();

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
    return rest.get('http://myapi.com').should.eventually.be.fulfilled;
  });

  it('should return a rejected promise',function(){
    return rest.get('http://googldsdsde.com').should.eventually.be.rejectedWith(Error);
  });
});

describe('Parrallel request return', function(){
  it('should be a object with an object and an error', function(done){
    rest.parallelGet({'one':{'url':'http://myapi.com'},
                      'two':{'url':'http://dsadsadsadasdas.com'}}, function(err, results){
                        if (err) return done(err);
                        results.should.have.property('oi');
                        done();
                      });
  });
});
