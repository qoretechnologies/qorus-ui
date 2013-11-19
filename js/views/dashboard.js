define([
  'jquery',
  'underscore',
  'settings',
  'utils',
  'qorus/qorus',
  'collections/stats',
  'text!../../templates/dashboard.html',
  'views/common/chart',
  'views/system/alerts',
  'views/system/health'
], function($, _, settings, utils, Qorus, StatsCollection, Template, ChartView, AlertView, HealthView){
  
  var Summary = Qorus.Model.extend({
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
          color: '#aded9b'
        },
        {
          name: 'ERROR',
          value: this.get('ERROR'),
          color: '#b94a48'
        },
        {
          name: 'COMPLETED',
          value: this.get('COMPLETE'),
          color: '#468847'
        }
      ];
      console.log('vals')
      return vals;
    }
  });
  
  var DashboardView = Qorus.View.extend({
    template: Template,
    initialize: function (opts) {
      _.bindAll(this);
      this.views = {};
      this.opts = opts || {};
      
      this.template = Template;
      _.defer(this.render);
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

      this.setView(new AlertView(), '#alerts');
    },
    
    onRender: function () {
      this.setView(new HealthView(), '#health', true);
    }

  });
  return DashboardView;
});
