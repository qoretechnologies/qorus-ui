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
    parseDate: function(date, format){
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
    formatDate: function(date){
        return date.format(settings.DATE_DISPLAY);
    },
    getNextDate: function(cron_time){
        var next = later().getNext(cronParser().parse(cron_time));
            
        return this.parseDate(next, null);
    }
  };
    
  return utils;
});