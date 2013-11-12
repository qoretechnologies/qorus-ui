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
    events_received: 0,

    // comparator: function (m1, m2) {
    //   if (m1.get('time') > m2.get('time')) return -1;
    //   if (m2.get('time') > m1.get('time')) return 1;
    //   return 0;
    // },
    
    wsAdd: function (e) {
      var self = this;
      var models = JSON.parse(e.data);
      
      // drop older messages
      if (this.length + models.length > this.log_size - 1) {
        var len = this.log_size - models.length;
        this.reset(this.slice(-len));
      }
      
      _.each(models, function (model) {
        var m = new Model(model);
        self.add(m);
        self.events_received++;
        Dispatcher.dispatch(m);
      });
      // debug.log(this.models.length, this.length, this.models);
      
      this.timeout_buffer++;
      clearTimeout(this.timeout);
      
      // waiting for triggering events update for a while
      if (this.timeout_buffer >= this.timeout_buffer_max) {
        this.timeout_buffer = 0;
        this.trigger('sync');
        // debug.log('empting buffer');
      } else {
        this.timeout = setTimeout(function () {
          self.trigger('sync');
          self.timeout_buffer = 0;
          // debug.log('executing timeout function');
        }, 5*1000);
      }
      // debug.log('Total events received: ', self.events_received);
    },

    wsOpened: function () {
      this.counter++;
      this.trigger('ws-opened', this); 

      var msg = "Connected to Qorus instance";
      
      if(this.counter > 1){
        // change message
        msg = 'We are back!';
        
        // refresh current view
        console.log('refreshing', Backbone.history.fragment);
        var fragment = Backbone.history.fragment;
        // null fragment
        Backbone.history.fragment = null;
        // refresh the page
        Backbone.history.navigate(fragment, { trigger: true });
      }
      
      msngr.post({ message: msg, type: "success", hideAfter: 5, id: 'ws-connection' }); 
    },

    wsRetry: function () {
      msngr.post({ message: "<i class=\"icon-warning-sign icon-large\"></i> Disconnected from Qorus instance!", type: "error", id: 'ws-connection' }); 
      this.trigger('ws-closed', this);
      setTimeout(this.connect, 5000);
    },
    
    hasNextPage: function () {
      return false;
    }
  });
  
  return Collection;
});