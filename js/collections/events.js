define(function (require) {
  var settings     = require('settings'),
      _            = require('underscore'),
      localStorage = require('localstorage'),
      Qorus        = require('qorus/qorus'),
      Model        = require('models/event'),
      Dispatcher   = require('qorus/dispatcher'),
      Messenger    = require('messenger'),
      utils        = require('utils'),
      msngr, Collection;
  
  msngr = $('#msg').messenger();
  
  Collection = Qorus.WSCollection.extend({
    log_size: 500,
    counter: 0,
    socket_url: settings.EVENTS_WS_URL,
    timeout_buffer: 0,
    timeout_buffer_max: 50,
    events_received: 0,
    event_queue: [],
    
    localStorage: new Backbone.LocalStorage('Qorus.Events'),
    
    // comparator: function (m1, m2) {
    //   if (m1.get('time') > m2.get('time')) return -1;
    //   if (m2.get('time') > m1.get('time')) return 1;
    //   return 0;
    // },
    
    initialize: function () {
      _.bindAll(this);
      Collection.__super__.initialize.apply(this, arguments); 
      this.model = Model;
    },
    
    wsAdd: function (e) {
      var self       = this,
          models, len, sliced;

      models = JSON.parse(e.data);
      
      _.each(models, function (model) {
        model = Model.prototype.parse(model);
        var m = new Model(model);
        self.event_queue.push(m);
        self.events_received++;
        Dispatcher.dispatch(m);
      });

      this.garbage_collection();
      
      this.timeout_buffer++;
      clearTimeout(this.timeout);
      
      // waiting for triggering events update for a while
      if (this.timeout_buffer >= this.timeout_buffer_max) {
        this.timeout_buffer = 0;
        this.processQueue();
        // debug.log('empting buffer');
      } else {
        this.timeout = setTimeout(function () {
          self.processQueue();
          self.timeout_buffer = 0;
          // debug.log('executing timeout function');
        }, 5*1000);
      }
      debug.log('Total events received: ', self.events_received);
    },

    wsOpened: function () {
      this.counter++;
      this.trigger('ws-opened', this); 

      var msg = "Connected to Qorus instance";
      
      if(this.counter > 1){
        // change message
        msg = 'We are back!';
        
        // refresh current view
        // console.log('refreshing', Backbone.history.fragment);
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
    },
    
    // fetch: function () {},
    // sync: function () {},
    empty: function () {
      _.invoke(this.models, 'destroy');
    },
    
    processQueue: function () {
      var events = [], new_models;
      while (this.event_queue.length > 0) {
        events.push(this.event_queue.shift());
      }
      new_models = this.add(events);

      _.each(new_models, function (model) {
        model.save();
      });

      this.trigger('queue:empty', new_models);
      this.trigger('sync');
    },
    
    garbage_collection: function () {
      var m;
      // console.log(this.size(), this.log_size);
      while (this.size() >= this.log_size) {
        m = this.shift();
        this.localStorage.destroy(m);
        m.trigger('destroy');
      }
    }
  });
  
  return new Collection();
});
