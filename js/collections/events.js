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
  
  var Collection = Qorus.WSCollection.extend({
    model: Model,
    log_size: 500,
    counter: 0,
    socket_url: settings.EVENTS_WS_URL,
    timeout_buffer: 0,
    timeout_buffer_max: 50,

    comparator: function (m) {
      return -m.get('time');
    },
    
    wsAdd: function (e) {
      var _this = this;
      var models = JSON.parse(e.data);
      
      // drop older messages
      if (this.length + models.length > this.log_size - 1) {
        var len = this.log_size - models.length;
        this.reset(this.slice(-len));
      }
      
      _.each(models, function (model) {
        var m = new Model(model);
        _this.add(m);
        Dispatcher.dispatch(m);
      });
      // console.log(this.models.length, this.length, this.models);
      
      this.timeout_buffer++;
      clearTimeout(this.timeout);
      
      // waiting for triggering events update for a while
      if (this.timeout_buffer >= this.timeout_buffer_max) {
        this.timeout_buffer = 0;
        this.trigger('update');
        console.log('empting buffer');
      } else {
        this.timeout = setTimeout(function () {
          _this.trigger('update');
          _this.timeout_buffer = 0;
          console.log('executing timeout function');
        }, 5*1000);
      }    
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