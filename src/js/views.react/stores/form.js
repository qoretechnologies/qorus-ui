define(function (require) {
  var Reflux            = require('reflux'),
      RefluxStateStore  = require('views.react/stores/mixins/statestore');
  
  return function (actions) {
    return Reflux.createStore({
      listenables: [actions],
      mixins: [RefluxStateStore],
      onSubmit: function (values) {
        this.setState({ form: values });
      }
    });    
  };
});