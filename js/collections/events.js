define(function (require) {
  var settings     = require('settings'),
      _            = require('underscore'),
      Qorus        = require('qorus/qorus'),
      Model        = require('models/event'),
      Dispatcher   = require('qorus/dispatcher'),
      Messenger    = require('messenger'),
      utils        = require('utils'),
      Parallel     = require('parallel'),
      msngr, Collection, event_refresh;
  
  msngr = $('#msg').messenger();
  
  event_refresh = { 
    "time" : moment().format("YYYY-MM-DD HH:mm:ss.SSS Z"), 
    "classstr" : "WEBAPP",
    "eventstr" : "WEBAPP_RECONNECTED", 
    "severity" : 0, 
    "severitystr" : "INFO", 
    "caller" : "<webapp>",
    "info": {
      "cls": "webapp",
      "name": "Webapp Reconnected"
    }
  };
  
  Collection = Qorus.WSCollection.extend({
    log_size: 500,
    counter: 0,
    socket_url: settings.EVENTS_WS_URL,
    timeout_buffer: 0,
    timeout_buffer_max: 50,
    events_received: 0,
    event_queue: [],

    localStorage: new Backbone.LocalStorage('Events'),

    // comparator: function (m1, m2) {
    //   if (m1.get('time') > m2.get('time')) return -1;
    //   if (m2.get('time') > m1.get('time')) return 1;
    //   return 0;
    // },
    
    initialize: function () {
      var self = this;

      Collection.__super__.initialize.apply(this, arguments); 
      this.model = Model;
      this.on('queue:empty', this.garbage_collection);
      this.on('sync', function () { self.event_queue.push(new Model(event_refresh)); self.processQueue(); });
      this.fetch();
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
      var self  = this,
          ls    = this.localStorage,
          store = ls.localStorage(),
          name  = ls.name,
          re    = new RegExp('^' + name + '-');

      // clean table rows
      _.each(this.models, function (model) {
        model.trigger('destroy', model, self);
        self.remove(model);
      });
      
      // clean local storage
      _.each(_.keys(store), function (key) {
        if (re.test(key) || key === name)
          store.removeItem(key);
      });
      
      ls.records = [];
      ls.save();
    },
    
    processQueue: function () {
      var events = [], ev;
      while (this.event_queue.length > 0) {
        ev = this.event_queue.shift();
        events.push(ev);
        this.localStorage.create(ev);
      }
      this.add(events);
      
      this.trigger('queue:empty', events);
      // this.trigger('sync');
    },
    
    garbage_collection: function () {
      var m, id;

      while (this.size() > this.log_size) {
        m = this.at(0);
        this.destroy(m);
      }
    },
    
    // destroy manually to speed up
    destroy: function (m) {
      var store = this.localStorage,
          ls    = store.localStorage(), 
          id    = this.localStorage.name + '-' + m.id;
         
      store.records = _.reject(store.records, function (id) { return id === m.id.toString(); });
      ls.removeItem(id);
      this.remove(m);
      store.save();
      m.trigger('destroy', m, this);
    }
  });
  
  return new Collection();
});
