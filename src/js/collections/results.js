define(function (require) {
  var settings = require('settings'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/result'),
      Dispatcher = require('qorus/dispatcher'),
      Collection;

  Collection = Qorus.SortedCollection.extend({
    sort_key: 'job_instanceid',
    sort_order: 'des',
    model: Model,

    api_events_list: [
      "job:instance_stop",
    ],

    url: function () {
      return settings.REST_API_PREFIX + '/jobs/'+ this.jobid + '/results';
    },

    initialize: function (models, opts) {
      Collection.__super__.initialize.apply(this, arguments);
      this.opts.sort = 'job_instanceid';

      if (_.has(opts, 'jobid')) {
        this.jobid = opts.jobid;
        delete opts.jobid;
      } else {
        this.url = settings.REST_API_PREFIX + '/jobs';
      }

      if (this.opts.statuses == 'all' || !this.opts.statuses) {
        delete this.opts.statuses;
      }
      this.listenTo(Dispatcher, this.api_events, this.dispatch);
    },

    dispatch: function (e, evt) {
      console.log(e, evt);
    }
  });

  return Collection;
});
