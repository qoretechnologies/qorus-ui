define(function (require) {
  var Reflux = require('reflux');
  
  return function () {
    return Reflux.createActions([
      'submit'
    ]);
  };
});