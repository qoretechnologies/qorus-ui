define(function (require) {  
  var Router   = require('router'),
      initialize;
  
  initialize = function () {
    debug.log('initializing router');
    Router.initialize();
  };

  return {
    initialize: initialize
  };
});
