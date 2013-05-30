define([
  'jquery',
  'underscore',
  'qorus/qorus'
], function($, _, Qorus){
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
        _this.trigger(evt, e);
        console.log("Dispatching", evt);
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
    }
  })
  
  var dispatcher = new Dispatcher();

  return dispatcher;
});
