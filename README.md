restling
========

A nodejs library to make promise based asynchronous http requests.


## Tutorial

Promises have a ``then`` method, which you can use to get the eventual
return value (fulfillment) or thrown exception (rejection).

```javascript
rest = require('restling');

rest.get('http://path/api', {param: 1, param:2})
.then(function (data) {
  console.log(data);
}, function (err) {
  console.log(err);
});
```
