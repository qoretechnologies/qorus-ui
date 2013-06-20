define([
  'settings',
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/event',
  'qorus/dispatcher',
  'messenger'
], function(settings, _, Backbone, Qorus, Model, Dispatcher, Messenger){
  var msngr = $('#msg').messenger();
  
  var Collection = Qorus.SortedWSCollection.extend({
    model: Model,
    log_size: 1000,
    counter: 0,
    socket_url: settings.EVENTS_WS_URL,

    initialize: function (opts) {
      this.sort_key = 'time';
      this.sort_order = 'des';
      this.sort_history = [''];
      
      Collection.__super__.initialize.call(this, opts);
    },

    wsAdd: function (e) {
      var _this = this;
      var models = JSON.parse(e.data);
      
      // drop older messages
      if (this.length > this.log_size - 1) {
        this.models = this.slice(0, this.log_size - models.length);
      }
      
      _.each(models, function (model) {
        var m = new Model(model);
        _this.add(m);
        Dispatcher.dispatch(m);
      });
      this.trigger('update', this);
    },

    wsOpened: function () {
      this.counter++;
      this.trigger('ws-opened', this); 

      var msg = "Connected to Qorus instance";
      
      if(this.counter > 1){
        msg = 'We are back!';
      }
      
      msngr.post({ message: msg, type: "success", hideAfter: 5, id: 'ws-connection' }); 
    },

    wsRetry: function () {
      msngr.post({ message: "<i class=\"icon-warning-sign icon-large\"></i> Qorus instance is down!", type: "error", id: 'ws-connection' }); 
      this.trigger('ws-closed', this);
      setTimeout(this.connect, 5000);
    }
  });
  
  return Collection;
});