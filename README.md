Restling
=======

A nodejs library to make promise based asynchronous http requests.
This module uses [restler](https://github.com/danwrong/restler) to make the http calls and [q](https://github.com/kriskowal/q) to transform it in promises.

Installing
----------

```
npm install restler
```

Features
--------
* Easy interface for common operations via http.request
* Automatic serialization of post data
* Automatic serialization of query string data
* Automatic deserialization of XML, JSON and YAML responses to JavaScript objects
* Provide your own deserialization functions for other datatypes
* Automatic following of redirects
* Send files with multipart requests
* Transparently handle SSL (just specify https in the URL)
* Deals with basic auth for you, just provide username and password options
* Simple service wrapper that allows you to easily put together REST API libraries
* Transparently handle content-encoded responses (gzip, deflate)
* Transparently handle different content charsets via [iconv-lite](https://github.com/ashtuchkin/iconv-lite)

API
---
### request(url, options)

Basic method to make a request of any type. The function returns a promise object:

### get(url, options)

Create a GET request.

### post(url, options)

Create a POST request.

### put(url, options)

Create a PUT request.

### del(url, options)

Create a DELETE request.

### head(url, options)

Create a HEAD request.

### patch(url, options)

Create a PATCH request.

### Parsers

You can give any of these to the parsers option to specify how the response data is deserialized.
In case of malformed content, parsers emit `error` event. Original data returned by server is stored in `response.raw`.

#### parsers.auto

Checks the content-type and then uses parsers.xml, parsers.json or parsers.yaml.
If the content type isn't recognised it just returns the data untouched.

#### parsers.json, parsers.xml, parsers.yaml

All of these attempt to turn the response into a JavaScript object. In order to use the YAML and XML parsers you must have yaml and/or xml2js installed.

### Options

* `method` Request method, can be get, post, put, delete. Defaults to `"get"`.
* `query` Query string variables as a javascript object, will override the querystring in the URL. Defaults to empty.
* `data` The data to be added to the body of the request. Can be a string or any object.
Note that if you want your request body to be JSON with the `Content-Type: application/json`, you need to
`JSON.stringify` your object first. Otherwise, it will be sent as `application/x-www-form-urlencoded` and encoded accordingly.
Also you can use `json()` and `postJson()` methods.
* `parser` A function that will be called on the returned data. Use any of predefined `restler.parsers`. See parsers section below. Defaults to `restler.parsers.auto`.
* `encoding` The encoding of the request body. Defaults to `"utf8"`.
* `decoding` The encoding of the response body. For a list of supported values see [Buffers](http://nodejs.org/api/buffer.html#buffer_buffer). Additionally accepts `"buffer"` - returns response as `Buffer`. Defaults to `"utf8"`.
* `headers` A hash of HTTP headers to be sent. Defaults to `{ 'Accept': '*/*', 'User-Agent': 'Restler for node.js' }`.
* `username` Basic auth username. Defaults to empty.
* `password` Basic auth password. Defaults to empty.
* `accessToken` OAuth Bearer Token. Defaults to empty.
* `multipart` If set the data passed will be formated as `multipart/form-encoded`. See multipart example below. Defaults to `false`.
* `client` A http.Client instance if you want to reuse or implement some kind of connection pooling. Defaults to empty.
* `followRedirects` If set will recursively follow redirects. Defaults to `true`.
* `timeout` If set, will emit the timeout event when the response does not return within the said value (in ms)
* `rejectUnauthorized` If true, the server certificate is verified against the list of supplied CAs. An 'error' event is emitted if verification fails. Verification happens at the connection level, before the HTTP request is sent. Default true.


Example usage
-------------

```javascript
var rest = require('./restling');

var successCallback = function(result){
console.log('Data: ' + error);
console.log('Response: ' + result.response);
};

var errorCallback = function(result){
  console.log('Error: ' + error);
  console.log('Response: ' + result.response);
};

rest.get('http://google.com').then(successCallback, errorCallback);

// auto convert json to object
rest.get('http://twaud.io/api/v1/users/danwrong.json')
  .then(successCallback, errorCallback);

// auto convert xml to object
rest.get('http://twaud.io/api/v1/users/danwrong.xml')
  .then(successCallback, errorCallback);

rest.get('http://someslowdomain.com',{timeout: 10000})
  .then(successCallback, errorCallback);

rest.post('http://user:pass@service.com/action', {
  data: { id: 334 },
}).then(function(result) {
  if (result.response.statusCode == 201) {
    result.data;// you can get at the raw response like this...
  }
},
errorCallback);

// multipart request sending a 321567 byte long file using https
rest.post('https://twaud.io/api/v1/upload.json', {
  multipart: true,
  username: 'danwrong',
  password: 'wouldntyouliketoknow',
  data: {
    'sound[message]': 'hello from restler!',
    'sound[file]': rest.file('doug-e-fresh_the-show.mp3', null, 321567, null, 'audio/mpeg')
  }
}).then(successCallback, errorCallback);
```

TODO
----
* json(url, data, options)
* postJson(url, data, options)
* putJson(url, data, options)
* What do you need? Let me know or fork.
