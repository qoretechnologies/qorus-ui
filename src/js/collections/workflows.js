define(function (require) {
  var settings  = require('settings'),
      _         = require('underscore'),
      Qorus     = require('qorus/qorus'),
      Model     = require('models/workflow'),
      moment    = require('moment'),
      utils     = require('utils'),
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
      this.sort_history = ['name','-version'];
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

    setOptions: function (opts) {
      if (opts.date) {
        opts.date = utils.parseDate(opts.date);
      }

      this.opts = _.extend({}, this.opts, opts);
    },

    setDate: function (date) {
      this.setOptions({ date: date });
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
