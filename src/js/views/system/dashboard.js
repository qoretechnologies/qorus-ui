define(function (require) {
  var $               = require('jquery'),
      _               = require('underscore'),
      settings        = require('settings'),
      utils           = require('utils'),
      Qorus           = require('qorus/qorus'),
      StatsCollection = require('collections/stats'),
      Template        = require('tpl!templates/system/dashboard.html'),
      ChartView       = require('views/common/chart'),
      AlertView       = require('views/system/alerts'),
      StatusTpl       = require('tpl!templates/system/health/summary.html'),
      Dispatcher      = require('qorus/dispatcher'),
      Summary, DashboardView, HealthModel, StatusView;
  
  Summary = Qorus.Model.extend({
    __name__: 'Summary',
    defaults: {
      'READY': 0,
      'ERROR': 0,
      'COMPLETE': 0
    },
    
    url: function () {
      var url = settings.REST_API_PREFIX + '/orders';
      return url + '?' + $.param(this.opts);
    },

    initialize: function (atrs, opts) {
      this.opts = opts || {};
      this.opts.action = 'orderSummary';
    },
    
    getDataset: function () {
      var vals = [
         {
          name: 'READY',
          value: this.get('READY'),
          color: '#c5e08c'
        },
        {
          name: 'ERROR',
          value: this.get('ERROR'),
          color: '#b94a48'
        },
        {
          name: 'COMPLETED',
          value: this.get('COMPLETE'),
          color: '#9ccb3b'
        }
      ];
      return vals;
    }
  });
  
  HealthModel = Qorus.Model.extend({
    __name__: 'HealthModel',
    url: settings.REST_API_PREFIX + '/system/health',
    parse: function (response, options) {
      var local, remote;
      local = response;
      remote = response.remote;
      
      response =  { local: local, remote: remote };
      return response;
    }
  });
  
  StatusView = Qorus.View.extend({
    __name__: 'StatusView',
    template: StatusTpl,
    initialize: function (opts) {
      this.views = {};
      this.context = {};
      this.options = {};
      this.opts = opts || {};
      this.model = new HealthModel();

      this.model.fetch();
      
      this.on('prerender', function (self) { 
        _(self.context).extend(this.model.toJSON());
        self.context.statusToCSS = self.statusToCSS;
      });
      
      this.listenTo(Dispatcher, 'system', this.update);
      this.listenTo(this.model, 'sync change', this.render);
    },
    
    statusToCSS: function (health) {
      if (health === 'RED') return 'important';
      if (health === 'GREEN') return 'success';
      if (health === 'YELLOW') return 'warning';
      if (health === 'UNKNOWN') return 'info';
      if (health === 'UNREACHABLE') return 'warning';
      return '';
    },
    
    update: function () {
      this.model.fetch();
    },
    
    onRender: function () {
      this.$('[data-toggle=tooltip]').tooltip();
    },
    
    preRender: function () {
      this.clean();
    },
    
    clean: function () {
      this.$('[data-toggle=tooltip]').tooltip('destroy');
    }
  })
  
  DashboardView = Qorus.View.extend({
    __name__: 'DashboardView',
    template: Template,
    initialize: function (opts) {
      this.views = {};
      this.context = {};
      this.options = {};
      this.opts = opts || {};
    },
    
    preRender: function () {
      this.setView(
        new ChartView.LineChart(
          { width: 500, height: 200 }, 
          new StatsCollection()
        ), '#chart-1');
      
      this.setView(
        new ChartView.DoughnutChart(
          { width: 200, height: 200 }, 
          new Summary()
        ), '#chart-1-doughnut');
      
      this.setView(new AlertView(), '#dashboard-alerts');
      this.setView(new StatusView({ model: this.opts.model }), '#health-summary');
    }
  });
  return DashboardView;
});
