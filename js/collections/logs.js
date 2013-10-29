define([
  'settings',
  'underscore',
  'backbone',
  'qorus/qorus',
  'qorus/dispatcher',
  'messenger'
], function(settings, _, Backbone, Qorus, Dispatcher, Messenger){
  var host = window.location.host;

  var msngr = $('#msg').messenger();
  
  var Collection = Qorus.WSCollection.extend({
    log_size: 100,
    counter: 0,
    socket_url: "ws://" + host + "/log",
    messages: "",

    initialize: function (models, opts) {
      _.bindAll(this);
      this.socket_url += opts.socket_url;
      Collection.__super__.initialize.call(this, models, opts);
    },
    
    wsAdd: function (e) {
      this.trigger('message', this, e.data);
    }
  });
  
  return Collection;
});