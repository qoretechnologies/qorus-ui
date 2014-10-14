define(function(require){
  var settings   = require('settings'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Collection;
  
  Collection = Qorus.WSCollection.extend({
    log_size: 100,
    counter: 0,
    socket_url: settings.WS_HOST + "/log",
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