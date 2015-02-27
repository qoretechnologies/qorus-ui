define(function (require) {
  var Reflux  = require('reflux'),
      _       = require('underscore');
  
  return function (actions) {
    return Reflux.createStore({
      listenables: [actions],
      init: function () {
        this.state = {
          active_index: 0
        };
      },
      
      onTabChange: function (idx)  {
        this.setState({ active_index: idx });
        this.trigger(this.state);
      },
      
      setState: function (state) {
        this.state = _.extend(this.state, state);
      },
      
      onReset: function () {
        this.setState({ active_index: 0 });
      }
    });      
  };
});