define(function (require) {
  var settings  = require('settings'),
      _         = require('underscore'),
      Qorus     = require('qorus/qorus'),
      Model     = require('models/workflow'),
      moment    = require('moment'),
      Collection, defaults;
  
  defaults = {
    'IN-PROGRESS': 0,
    'READY': 0,
    'SCHEDULED': 0,
    'COMPLETE': 0,
    'INCOMPLETE': 0,
    'ERROR': 0,
    'CANCELED': 0,
    'RETRY': 0,
    'WAITING': 0,
    'ASYNC-WAITING': 0,
    'EVENT-WAITING': 0,
    'BLOCKED': 0,
    'CRASH': 0,
    'TOTAL': 0
  };
  
  Collection = Qorus.SortedCollection.extend({
    __name__: 'WorkflowCollection',
    url: settings.REST_API_PREFIX + '/workflows/',
    date: null,
    model: Model,
    pagination: false,
    
    initialize: function (models, opts) {
      this.sort_key = 'exec_count';
      this.sort_order = 'des';
      this.sort_history = ['name'];
      this.opts = {};
      this.opts.deprecated = false;
      
      if (opts) {
          this.opts = opts;
          this.opts.deprecated = (opts.deprecated === 'hidden'); 
      }
    },
    
    parse: function (response, options) {
      _.map(response, function (model) { 
        _.defaults(model, defaults);
      });
      return response;
    },
    
    setDate: function (date) {
      this.date_format = settings.DATE_DISPLAY;
      
      if (date === undefined || date === null || date === '24h') {
        date = moment().add('days', -1).format(this.date_format);
      } else if (date == 'all') {
        date = moment(settings.DATE_FROM).format(this.date_format);
      } else if (date.match(/^[0-9]+$/)) {
        date = moment(date, 'YYYYMMDDHHmmss').format(this.date_format);
      } else {
        date = date;
      }
      
      this.opts.date = date;
    },
    
    getDate: function () {
      return this.opts.date;
    },
    
    setSortKey: function (key, order) {
      var prev_key = this.sort_key;
      
      this.sort_key = key;
      this.sort_order = order || this.sort_order;

      if (this.sort_history) {
        this.sort_history.push(prev_key);
      }
      
      this.sort();
    }
  });

  return Collection;
});
