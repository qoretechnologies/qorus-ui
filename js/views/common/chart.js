define([
  'module',
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!../../../templates/common/chart.html',
  'chart'
], function (self, $, _, Qorus, ChartTpl) {
  var LineStyles = [
    {
      fillColor : "rgba(250,225,107,0.5)",
      strokeColor : "rgba(250,225,107,1)",
      pointColor : "rgba(250,225,107,1)",
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(169,204,143,0.5)",
      strokeColor : "rgba(169,204,143,1)",
      pointColor : "rgba(169,204,143,1)",
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(178,200,217,0.5)",
      strokeColor : "rgba(178,200,217,1)",
      pointColor : "rgba(178,200,217,1)",
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(190,163,122,0.5)",
      strokeColor : "rgba(190,163,122,1)",
      pointColor : "rgba(190,163,122,1)",
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(243,170,121,0.5)",
      strokeColor : "rgba(243,170,121,1)",
      pointColor : "rgba(243,170,121,1)",
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(181,181,169,0.5)",
      strokeColor : "rgba(181,181,169,1)",
      pointColor : "rgba(181,181,169,1)",
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(230,165,164,0.5)",
      strokeColor : "rgba(230,165,164,1)",
      pointColor : "rgba(230,165,164,1)",
      pointStrokeColor : "#fff"
    }
  ];
  

  var ChartView = Qorus.View.extend({
    template: ChartTpl,
    dataset: null,
    
    initialize: function (opts, collection) {
      _.bindAll(this);
      this.opts = opts;

      // set collection and collection events
      this.collection = collection;
      this.collection.on('sync', this.updateDataset);
      this.collection.fetch();
      
      var chart = {
        'width': this.opts.width || 400,
        'height': this.opts.height || 400,
        'id': this.cid + '-' + this.collection.step
      };

      _.extend(this.context, { chart: chart });
    },
    
    onRender: function () {
      // create chart only if dataset available
      if (this.dataset) {
        var cnv = this.$("canvas").get(0);
        if (cnv) {
          var ctx = cnv.getContext("2d");
          var myChart = new Chart(ctx).Line(this.dataset, { datasetFill: false });
        }        
      }
    },
    
    updateDataset: function () {
      this.dataset = this.styleData(this.collection.getDataset());
      _.extend(this.context, { legend: this.getLegend() });
      this.render();
    },
    
    styleData: function (dataset) {
      var c = 0;
      _.each(dataset.datasets, function (set) {
        _.extend(set, LineStyles[c]);
        c++;
      });
      return dataset;
    },
    
    getLegend: function () {
      var legend = [];
      if (this.dataset) {
        _.each(this.dataset.datasets, function (d) {
          legend.push({
            'name': d.desc,
            'color': d.strokeColor
          })
        });
      }
      return legend;
    }
  });
  
  return ChartView;
});