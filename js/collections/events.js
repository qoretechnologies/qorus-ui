define([
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/event'
], function(_, Backbone, Qorus, Model){
  console.log(Model.prototype.idAttribute);
  var Collection = Qorus.Collection.extend({
    // url: "/rest/events/",
    model: Model,
    initialize: function () {
      _.bindAll(this);
      this.socket = new WebSocket("ws://localhost:8001");
      this.socket.onmessage = this.wsAdd;
    },
    wsAdd: function(e){
      var _this = this;
      var models = JSON.parse(e.data);
      console.log("Adding", models);
      _.each(models, function(model){
        _this.add(model);
      });
    }
  });
  return Collection;
});