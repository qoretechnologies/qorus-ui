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
      this.trigger(ev[0], e);
      this.trigger(ev.join(':'), e);
      console.log('Dispatching ->', ev.join(':'));
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
