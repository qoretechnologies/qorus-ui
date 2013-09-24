define([
  'module',
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!../../../templates/common/chart.html',
  'chart'
], function (self, $, _, Qorus, ChartTpl) {

  var ChartView = Qorus.View.extend({
    step: 1,
    template: ChartTpl,
    
    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts;
      this.dataset = this.opts.dataset;
      
      var chart = {
        'width': this.opts.width || 400,
        'height': this.opts.height || 400,
        'id': this.cid
      };
      _.extend(this.context, { chart: chart });
    },
    
    onRender: function () {
      var ctx = this.$("canvas").get(0).getContext("2d");
      var myChart = new Chart(ctx).Line(this.dataset);
    }
  });
  
  return ChartView;
});