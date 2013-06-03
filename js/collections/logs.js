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
  
  var Collection = Qorus.SortedWSCollection.extend({
    log_size: 1000,
    counter: 0,
    socket_url: "ws://" + host + "/log",
    messages: "",

    initialize: function (opts) {
      _.bindAll(this);
      this.sort_key = 'time';
      this.sort_order = 'des';
      this.sort_history = [''];
      
      this.socket_url += opts.socket_url;
      
      Collection.__super__.initialize.call(this, opts);
    },

    wsAdd: function (e) {
      this.trigger('message', this, e.data);
    },

    wsRetry: function () {
      setTimeout(this.connect, 5000);
    }
  });
  
  return Collection;
});