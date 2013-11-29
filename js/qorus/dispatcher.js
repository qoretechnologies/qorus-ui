define(function($, _, Qorus){
  var $     = require('jquery'),
      _     = require('underscore'),
      Qorus = require('qorus/qorus'),
      Dispatcher;

  // var msg = sprintf('Workflow %s %s done', _this.get('name'), action);
  // $.globalMessenger().post(msg);
  // var msg = sprintf('Service %d %s failed', id, action);
  // $.globalMessenger().post({ message: msg, type: 'error' });
  // var msg = sprintf('Job %d %s done', id, action);
  // $.globalMessenger().post(msg);
  
  Dispatcher = Backbone.Model.extend({
    add: function (e) {
      this.dispatch(e);
    },
    dispatch: function (e) {
      e = e.toJSON();
      var ev = this.eventParse(e.eventstr);
      
      var events = [ 
        ev[0],
        ev.join(':'),
        e.info.cls + ':' + e.info.id,
        e.info.cls + ':' + e.info.id + ':' + ev[1]
      ];
      
      var _this = this;
      _.each(events, function(evt){
        _this.trigger(evt, e, evt);
        // debug.log("Dispatching", evt);
      })
    },
    eventParse: function(name) {
      var pos = name.indexOf('_');
      
      if (pos > -1) {
        var who = name.slice(0, pos);
        var what = name.slice(pos + 1);
        return [who.toLowerCase(), what.toLowerCase()];
      }
      
      return [name.toLowerCase()];
    },
    
    alert: function (alert, text) {
      
    }
  })

  return new Dispatcher();
});
