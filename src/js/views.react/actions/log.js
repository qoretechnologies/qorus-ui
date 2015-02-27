define(function (require) {
  var Reflux = require('reflux');
  
  return function LogActions() {
    return Reflux.createActions([
      'connect',
      'message',
      'close',
      'toggleScroll',
      'togglePause'
    ]);    
  };
});