define([
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'settings',
  'later.cron'
], function($, _, Backbone, moment, settings, c){
    var utils = {
        parseDate: function(date, format){
            if (format===undefined){
                var d = moment(date, settings.DATE_FORMAT);
            } else if (format===null){
                var d = moment(date);
            } else {
                var d = moment(date, format);
            }
            
            return d;
        },
        formatDate: function(date){
            return date.format(settings.DATE_DISPLAY);
        },
        getNextDate: function(cron_time, last_time){
            var cron = cronParser;
            var last;
            if(last_time){
                last = last_time.toDate();
            }
            var next = later().getNext(cron().parse(cron_time, true), last);
            return this.parseDate(next, format=null);
        }
    }
    return utils;
});