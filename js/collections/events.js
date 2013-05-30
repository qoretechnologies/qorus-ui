define([
  'settings',
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/event',
  'qorus/dispatcher',
  'messenger'
], function(settings, _, Backbone, Qorus, Model, Dispatcher, Messenger){
  var host = window.location.host;

  var dispatcher = Dispatcher;
  var msngr = $('#msg').messenger();
  
  var Collection = Qorus.SortedCollection.extend({
    model: Model,
    log_size: 1000,
    counter: 0,

    initialize: function (opts) {
      _.bindAll(this, 'wsAdd', 'wsRetry', 'wsOpen', 'wsOpened', 'connect');
      this.sort_key = 'time';
      this.sort_order = 'des';
      this.sort_history = [''];
      
      this.connect();
      
      Qorus.SortedCollection.__super__.initialize.call(this, opts);
    },

    connect: function () {
      console.log('Connecting to WS');
      var _this = this;
      
      $.get(settings.REST_API_PREFIX + '/system?action=wstoken')
        .done(function (response) {
          _this.token = response;
          _this.wsOpen();
        })
        .fail(function () {
          console.log('Failed to get token. Retrying.', _this);
          _this.wsRetry();
        });
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
        dispatcher.dispatch(m);
      });
      this.trigger('update', this);
    },

    wsOpen: function () {      
      var url = "ws://" + host + '?token=' + this.token;
      
      try {
        this.socket = new WebSocket(url); 
        this.socket.onmessage = this.wsAdd;
        this.socket.onclose = this.wsRetry;
        this.socket.onopen = this.wsOpened;
        this.socket.onerror = this.wsError;
      } catch (e) {
        console.log(e);
      }
      this.socket.onerror = this.wsError;
    },

    wsError: function (e) {
      console.log(e);
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