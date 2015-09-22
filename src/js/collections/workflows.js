define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Helpers  = require('qorus/helpers'),
      Model    = require('models/workflow'),
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
    prefKey: 'ui.collections.workflows',

    initialize: function (models, opts) {
      var currentUser = Helpers.user;

      this.sort_key = currentUser.getPreferences(this.prefKey + '.sorting.key') || 'exec_count';
      this.sort_order = currentUser.getPreferences(this.prefKey + '.sorting.order') || 'des';
      this.sort_history = currentUser.getPreferences(this.prefKey + '.sorting.history') || ['name'];
      this.opts = {};
      this.opts.deprecated = false;

      if (opts) {
          this.opts = opts;
          this.opts.deprecated = opts.deprecated;
      }
    },

    parse: function (response, options) {
      _.map(response, function (model) {
        _.defaults(model, defaults);
      });
      return response;
    }
  });

  return Collection;
});
