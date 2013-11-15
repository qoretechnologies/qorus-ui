define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'qorus/qorus',
  'collections/stats',
  'text!../../templates/dashboard.html',
  'views/common/chart',
  'views/system/alerts'
], function($, _, Backbone, utils, Qorus, StatsCollection, Template, ChartView, AlertView){
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
          { width: 600, height: 200 }, 
          new StatsCollection()
        ), '#chart-1');

      this.setView(new AlertView(), '#alerts');
    }

  });
  return DashboardView;
});
