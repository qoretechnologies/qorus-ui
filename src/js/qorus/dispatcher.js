define(function (require) { 
  var _        = require('underscore'),
      Backbone = require('backbone'),
      Dispatcher;
  
  Dispatcher = {
    add: function (e) {
      this.dispatch(e);
    },
    
    dispatch: function (e) {
      var self = this,
          events = [],
          ev, ev_id;

      e = e.toJSON();
      
      ev = this.eventParse(e.eventstr);

      events.push(ev[0]);
      events.push(ev.join(':'));
      
      if (e.info) {
        if ('cls' in e.info) {
          ev_id = [e.info.cls, e.info.id].join(':');
          events.push(ev_id);
          events.push([ev_id, ev[1]].join(':'));
          
          //  || e.info.type !== 'alert'
          if (ev[0] === 'alert') {
            var id = [e.info.type, e.info.id].join(":");
            events.push(id.toLowerCase());
            events.push([id.toLowerCase(), e.eventstr.toLowerCase()].join(":").toLowerCase());
          }
        }
        if (instanceid = e.info.instanceid) {
          ev_id = ['order', instanceid].join(":");
          events.push(ev_id);
          events.push([ev_id, ev[1]].join(':'));
        }
      }
          
      _.each(events, function(evt){
        self.trigger(evt, e, evt);
      });
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
    
    // alert: function (alert, text) {
    //   
    // }
  };
  
  _.extend(Dispatcher, Backbone.Events)

  return Dispatcher;
});
