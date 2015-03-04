define(function (require) {
  var _ = require('underscore');
  
  return {
    init: function () {
      this.state = {};  
    },
    
    setState: function (state) {
      this.state = _.extend({}, this.state, state);
      this.trigger(this.state);
    }
  };
});