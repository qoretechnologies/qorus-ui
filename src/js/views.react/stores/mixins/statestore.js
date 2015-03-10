define(function (require) {
  var _ = require('underscore');
  
  return {
    /**
     * Executes on object initialization
     */
    init: function () {
      this.state = {};  
    },
    
    /**
     * Sets state and triggers updated state object
     * @param {object} state
     */
    setState: function (state) {
      this.state = _.extend({}, this.state, state);
      this.trigger(this.state);
    }
  };
});