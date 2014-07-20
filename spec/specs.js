var vows           = require('vows'),
    rest           = require('../restling'),
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

// Create a Test Suite

vows.describe('Restling').addBatch({
  'Is restling defined?':{
    topic: function(){
      return rest;
    },
    'rest is a object': function(topic){
      topic.should.exist.and.be.a('object');
    },
    'rest should have all methods': function(topic){
      methods.forEach(function(method){
        topic.should.have.property(method);
      });
    }
  }
}).addBatch({
  'Request succeeded': {
    topic: function(){
      return rest.get('http://www.google.com');
    },
    'returns a fulfilled promise': function(topic){
       topic.should.eventually.be.rejected;
    },
    'returns a rejected promise': function(topic){
      topic.should.eventually.be.rejected;
    }
  },
  'request in parallel when passing a object':{
    topic: function(){
      rest.parallelGet({'one':{'url':'http://www.google.com'}, 'two':{'url':'http://googldasdadase.com'}}, this.callback);
    },
    'returns a object': function(topic){
      topic.should.be.a('object');
    },
    'returns a object with properties "one" and "two"': function(topic){
      topic.should.have.property('one');
      topic.should.have.property('two');
    },
    'returns a object with property "one" being succeeded object': function(topic){
      topic.one.should.have.property('response');
      topic.one.should.have.property('data');
    },
    'returns a object with property "two" being a error object': function(topic){
      console.log(topic.two);
      topic.two.should.have.property('message');
      topic.two.should.have.property('code');
    }
  },
  'request in parallel when passing a array':{
    topic: function(){
      rest.parallelGet([{'url':'http://www.google.com'}, {'url':'http://googldasdadase.com'}], this.callback);
    },
    'returns a array': function(topic){
      topic.should.be.a('array');
    },
    'returns a array with length 2': function(topic){
      topic.should.have.length(2);
    },
    'returns a array with first is a succeeded object': function(topic){
      topic[0].should.have.property('response');
      topic[0].should.have.property('data');
    },
    'returns a object with property "two" being a error object': function(topic){
      console.log(topic.two);
      topic[1].should.have.property('message');
      topic[1].should.have.property('code');
    }
  }
}).run(); // Run it