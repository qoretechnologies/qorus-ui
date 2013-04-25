define([
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'settings',
  'later.recur',
  'later.cron'
], function($, _, Backbone, moment, settings){
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
    getStatusClass: function (status) {
      return this.status_map[status];
    }
  };
    
  return utils;
});