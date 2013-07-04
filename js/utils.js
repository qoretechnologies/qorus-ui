define([
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'settings',
  'later.recur',
  'later.cron'
], function ($, _, Backbone, moment, settings) {
  var utils = {
    settings: settings,
    status_map: {
      "waiting": "waiting",
      "async-waiting": "waiting",
      "event-waiting": "waiting",
      "error": "important",
      "in-progress": "warning",
      "complete": "success",
      "incomplete": "info",
      "canceled": "canceled",
      "retry": "error",
      "ready": "ready",
      "incomplete": "info",
      "scheduled": "info",
      "success": "success"
    },
    action_icons: {
      "unload": "remove-circle",
      "load": "off",
      "reset": "refresh"
    },
    
    parseDate: function (date, format) {
      var d;
      if (format===undefined){
          d = moment(date, settings.DATE_FORMAT);
      } else if (format===null){
          d = moment(date);
      } else {
          d = moment(date, format);
      }
            
      return d;
    },
    
    formatDate: function (date) {
        return date.format(settings.DATE_DISPLAY);
    },
    
    getNextDate: function (cron_time) {
        var next = later().getNext(cronParser().parse(cron_time));
            
        return this.parseDate(next, null);
    },
    
    getCurrentLocation: function () {
      return window.location.href;
    },
    
    getCurrentLocationPath: function () {
      return window.location.pathname;
    },
    
    flattenSerializedArray: function (object, except) {
      var exclude = _.isArray(except) ? except : [except];
      
      var data = {};
      _.each(object, function(obj) {
        if (_.indexOf(exclude, obj.name) === -1) {
          data[obj.name] = obj.value; 
        }
      });
      
      return data;
    },
    
    encodeDate: function (date) {
      return moment(date, settings.DATE_DISPLAY)
              .format('YYYYMMDDHHmmss');
    }
  };
    
  return utils;
});