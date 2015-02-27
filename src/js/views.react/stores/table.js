define(function (require) {
  var Reflux = require('reflux');
  
  return function (actions) {
    return Reflux.createStore({
      listenables: [actions],
      init: function () {
        this.state = {
          model: null,
          checked_ids: []
        };
      },
      
      getInitialState: function () {
        return this.state;
      },

      onRowClick: function (id) {
        this.state.model = (this.state.model == id) ? null : id;
        this.trigger(this.state);
      }
    });      
  }
});
