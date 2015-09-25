define(function (require) {
  var _           = require('underscore'),
      utils       = require('utils'),
      BaseToolbar = require('views/toolbars/toolbar'),
      Template    = require('text!templates/workflow/toolbars/workflows_toolbar.html'),
      CopyView    = require('views/common/table.copy'),
      getFilters  = require('views/workflows/utils').getFilters,
      Toolbar;

  var csv_options = {
    el: '#workflows table',
    ignore: [0,1,4]
  };

  Toolbar = BaseToolbar.extend({
    datepicker: true,
    template: Template,
    context: {},
    url: '/workflows/',
    url_options: function () {
      return {
        deprecated: getFilters(this.options)
      };
    },

    route: 'showWorkflows',

    initialize: function (opts) {
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      _.extend(this.context, _.pick(opts, ['deprecated', 'running', 'last']));
      this.context.setUrl = this.setUrl;

      this.setView(new CopyView({ csv_options: csv_options }), '#table-copy');
    },

    setUrl: function (params) {
      var path = utils.getCurrentLocationPath().slice(1);
      var parts = path.split('/');

      // var currentFilters = _.pick(this.opts, ['deprecated', 'running']);
      var filters = [];

      if (params.deprecated) {
        filters.push('hidden');
      }

      if (params.running) {
        filters.push('running');
      }

      if (params.last) {
        filters.push('last');
      }

      if (parts.length == 2) {
        url = [parts[0], parts[1], filters.join(',')].join('/');
      } else {
        url = [parts[0], parts[1] || '', filters.join(',')].join('/');
      }

      return url;
    }
  });

  return Toolbar;
});
