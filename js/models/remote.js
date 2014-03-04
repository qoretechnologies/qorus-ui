define(function (require) {
  var Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Model;
    
  Model = Qorus.ModelWithAlerts.extend({
    __name__: 'RemoteModel',
    idAttribute: 'name',
  
    // TODO: add api events for alerts updates
    api_events_list: [
      "remote:%(id)s:alert_ongoing_raised",
      "remote:%(id)s:alert_ongoing_cleared",
      "remote:%(id)s:alert_transient_raised"
    ],
    
    initialize: function () {
      Model.__super__.initialize.apply(this, arguments);
      this.listenTo(Dispatcher, this.api_events, this.dispatch);
    },
    
    dispatch: function (e, evt) {
      if (e.info[this.idAttribute] !== this.id) return;
      
      var evt_types = evt.split(':'),
          obj = evt_types[0],
          id = evt_types[1],
          action = evt_types[2] || id,
          alert = /^(alert_).*/;
      
      console.log(obj, action, alert.test(action), this);
      
      if (obj === 'remote') {
        if (alert.test(action)) {
          this.fetch();
        }
      } 
      // debug.log(m.attributes);
      this.trigger('fetch');
    },

    doPing: function () {
      var self = this;
      $.put(this.url(), { 'action': 'ping' })
        .done(function (response) {
          self.trigger('ping', response);
        });
    }
  });
  
  return Model;
});
