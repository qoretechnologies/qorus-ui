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
     * @param {object} options
     */
    setState: function (state, options) {
      options = options || {};
      this.state = _.assign(this.state, state);
      
      if (!options.silent) {
        this.trigger(this.state); 
      }
    }
  };
});