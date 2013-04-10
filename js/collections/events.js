define([
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/event'
], function(_, Backbone, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    model: Model,
    log_size: 100,
    initialize: function (opts) {
      _.bindAll(this, 'wsAdd');
      this.sort_key = 'time';
      this.sort_order = 'des';
      this.sort_history = ['',];
      this.socket = new WebSocket("ws://localhost:8001");
      this.socket.onmessage = this.wsAdd;
      Qorus.SortedCollection.__super__.initialize.call(this, opts);
    },
    wsAdd: function(e){
      var _this = this;
      var models = JSON.parse(e.data);
      
      // drop older messages
      if (this.length > this.log_size - 1){
        this.models = this.slice(0, this.log_size - models.length);
      }
      
      _.each(models, function(model){
        var m = new Model(model);
        _this.add(m);
      });
      this.trigger('update', this);
    }
  });
  return Collection;
});