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

    additionalEvents: {
      "click button[data-action]": 'applyFilter',
      "click a[data-action]": 'applyFilter'
    },

    initialize: function (opts) {
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      _.extend(this.context, _.pick(opts, ['deprecated', 'running', 'last']));
      this.context.setUrl = this.setUrl;

      this.setView(new CopyView({ csv_options: csv_options }), '#table-copy');
    },

    applyFilter: function (e) {
      var url;
      var params = _.pick(this.options, ['deprecated', 'running', 'last', 'query']);
      var $target = $(e.target);
      var filter = $target.attr('data-option');

      if (_.indexOf(filter, '=') >= 0) {
        var df = filter.split('=');
        params[df[0]] = df[1];
      } else {
        params[filter] = !this.options[filter];
      }

      url = this.setUrl(params);

      Backbone.history.navigate(url, { trigger: true });

      e.preventDefault();

      if ($target.tagName == 'a') {
        $target.parent().removeClass('open');
        e.stopPropagation();
      }
    },

    setUrl: function (params) {
      var path = utils.getCurrentLocationPath().slice(1);
      var parts = path.split('/');
      var date = (parts.length > 2) ? parts[1] : '24h';
      var url;

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

      if (params.date) {
        date = params.date;
      }

      url = [parts[0], date, filters.join(',')].join('/');

      if (params.query) {
        url += '?q=' + params.query;
      }

      return url;
    }
  });

  return Toolbar;
});
