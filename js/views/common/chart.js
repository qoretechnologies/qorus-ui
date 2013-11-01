define([
  'module',
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!../../../templates/common/charts/line.html',
  'text!../../../templates/common/charts/doughnut.html',
  'chart'
], function (self, $, _, Qorus, LineChartTpl, DoughnutChartTpl) {
  var ColorScheme = {
    clr1: "rgba(250,225,107,1)",
    clr2: "rgba(169,204,143,1)",
    clr3: "rgba(178,200,217,1)",
    clr4: "rgba(190,163,122,1)",
    clr5: "rgba(243,170,121,1)",
    clr6: "rgba(181,181,169,1)",
    clr7: "rgba(230,165,164,1)"
  };
  
  var LineStyles = [
    {
      fillColor : "rgba(250,225,107,0.5)",
      strokeColor : ColorScheme.clr1,
      pointColor : ColorScheme.clr1,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(169,204,143,0.5)",
      strokeColor : ColorScheme.clr2,
      pointColor : ColorScheme.clr2,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(178,200,217,0.5)",
      strokeColor : ColorScheme.clr3,
      pointColor : ColorScheme.clr3,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(190,163,122,0.5)",
      strokeColor : ColorScheme.clr4,
      pointColor : ColorScheme.clr4,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(243,170,121,0.5)",
      strokeColor : ColorScheme.clr5,
      pointColor : ColorScheme.clr5,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(181,181,169,0.5)",
      strokeColor : ColorScheme.clr6,
      pointColor : ColorScheme.clr6,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(230,165,164,0.5)",
      strokeColor : ColorScheme.clr7,
      pointColor : ColorScheme.clr7,
      pointStrokeColor : "#fff"
    }
  ];

  var ChartView = Qorus.View.extend({
    LineStyles: LineStyles,
    dataset: null,
    context: {
      legend: null,
      chart: null
    },
    
    initialize: function (opts, collection) {
      _.bindAll(this);
      this.opts = opts;

      if(_.has(opts, 'ColorScheme')) this.ColorScheme = opts.ColorScheme;
      if(_.has(opts, 'LineStyles')) this.LineStyles = opts.LineStyles;

      // set collection and collection events
      this.collection = collection;
      this.listenTo(this.collection, 'sync', this.updateDataset);
      console.log(this.collection.opts.date, this.collection, this.collection.id);
      this.collection.fetch();
      
      this.context.chart = {
        'width': this.opts.width || 400,
        'height': this.opts.height || 400,
        'id': this.cid + '-chart'
      };
    },
        
    updateDataset: function () {
      console.log('updating', this.cid, this.collection, this.collection.opts.date);
      this.dataset = this.styleData(this.collection.getDataset());
      this.context.legend = this.getLegend();
      this.context.chart = {
        'width': this.opts.width || 400,
        'height': this.opts.height || 400,
        'id': this.cid + '-chart'
      };
      this.render();
    },
    
    styleData: function (dataset) {
      var c = 0,
        LS = LineStyles,
        CS = _.values(this.ColorScheme);
        
      if (dataset.datasets) {

        _.each(dataset.datasets, function (set) {
          _.extend(set, LS[c]);
          c++;
        });
      } else {
        _.each(dataset, function (set) {
          if (!_.has(set, 'color')) {
            _.extend(set, { color: CS[c] });
            c++;
          }
        });
      }
      return dataset;
    },
    
    getLegend: function () {
      var legend = [];
      if (this.dataset) {
        if (this.dataset.datasets) {
          legend = _.map(this.dataset.datasets, function (d) { 
            return {
              'name': d.desc,
              'color': d.strokeColor
            };
        });
        } else {
          legend = _.map(this.dataset, function (d) { 
            return {
              'name': d.name,
              'color': d.color,
              'value': d.value
            };
          });
        }
      }
      return legend;
    }
  });
  
  var LineChart = ChartView.extend({
    template: LineChartTpl,
    onRender: function () {
      // create chart only if dataset available
      if (this.dataset) {
        var cnv = this.$("canvas").get(0);
        if (cnv) {
          var ctx = cnv.getContext("2d");
          var myChart = new Chart(ctx).Line(this.dataset, { datasetFill: false });
        }
      }
    }
  });
  
  var DoughnutChart = ChartView.extend({
    ColorScheme: ColorScheme,
    template: DoughnutChartTpl,
    onRender: function () {
      // create chart only if dataset available
      if (this.dataset) {
        var cnv = this.$("canvas").get(0);
        if (cnv) {
          var ctx = cnv.getContext("2d");
          var myChart = new Chart(ctx).Doughnut(this.dataset);
        }
      }
    }    
  });
  
  return {
    LineChart: LineChart,
    DoughnutChart: DoughnutChart
  };
});