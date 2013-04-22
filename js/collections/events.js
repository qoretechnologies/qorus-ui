define([
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/event'
], function(_, Backbone, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    model: Model,
    log_size: 1000,
    initialize: function (opts) {
      _.bindAll(this, 'wsAdd', 'wsRetry', 'wsOpen', 'wsOpened');
      this.sort_key = 'time';
      this.sort_order = 'des';
      this.sort_history = [''];
      this.wsOpen();
      this.on('ws-opened', function () { 
        $.globalMessenger().post({ message: "Connected to Qorus instance!", type: "info", hideAfter: 10, id: 'ws-connection' }); 
      });
      this.on('ws-closed', function () { 
        $.globalMessenger().post({ message: "Connection Failed", type: "error", id: 'ws-connection' }); 
      });
      Qorus.SortedCollection.__super__.initialize.call(this, opts);
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
      });

      this.trigger('update', this);
    },
    wsOpen: function () {
      this.socket = new WebSocket("ws://localhost:8001");
      this.socket.onmessage = this.wsAdd;
      this.socket.on
      this.socket.onclose = this.wsRetry;
      this.socket.onopen = this.wsOpened;
    },
    wsOpened: function () {
      this.trigger('ws-opened', this); 
    },
    wsRetry: function () {
      this.trigger('ws-closed', this);
      setTimeout(this.wsOpen, 5000);  
    }
  });
  return Collection;
});