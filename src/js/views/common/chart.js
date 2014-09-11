define(function (require) {
  require('chart');
  var _                = require('underscore'),
      Qorus            = require('qorus/qorus'),
      LineChartTpl     = require('tpl!templates/common/charts/line.html'),
      DoughnutChartTpl = require('tpl!templates/common/charts/doughnut.html'),
      ColorScheme, LineStyles, ChartView, LineChart, DoughnutChart, Config, DoughnutConfig;


  Config = {
    datasetFill: false,
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"legend-color-box\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
  };

  DoughnutConfig = _.extend({}, Config, {
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li data-idx=\"<%= i %>\"><span class=\"legend-color-box\" style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%> (<%= segments[i].value %>)<%}%></li><%}%></ul>"
  });
      
  
  ColorScheme = {
    clr1: "rgba(250,225,107,1)",
    clr2: "rgba(169,204,143,1)",
    clr3: "rgba(178,200,217,1)",
    clr4: "rgba(190,163,122,1)",
    clr5: "rgba(243,170,121,1)",
    clr6: "rgba(181,181,169,1)",
    clr7: "rgba(230,165,164,1)"
  };
  
  LineStyles = [
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

  ChartView = Qorus.View.extend({
    __name__: 'ChartView',
    scale: 1,
    cls: 'ChartView',
    LineStyles: LineStyles,
    dataset: null,
    context: {
      legend: null,
      chart: null
    },
    
    initialize: function (opts, collection) {
      this.context = {};
      this.views = {};
      this.options = {};
      this.opts = opts;

      if(_.has(opts, 'ColorScheme')) this.ColorScheme = opts.ColorScheme;
      if(_.has(opts, 'LineStyles')) this.LineStyles = opts.LineStyles;

      // set collection and collection events
      this.collection = collection;
      this.listenTo(this.collection, 'sync', this.updateDataset);
      this.collection.fetch();
      
      this.context.chart = {
        'width': this.opts.width || 400,
        'height': this.opts.height || 400,
        'id': this.cid + '-chart'
      };
    },
        
    updateDataset: function () {
      this.dataset = this.styleData(this.collection.getDataset());
      this.scaleData();
      this.context.legend = this.getLegend();
      this.context.chart = {
        'width': this.opts.width || 400,
        'height': this.opts.height || 400,
        'id': this.cid + '-chart'
      };
      this.render();
      // console.log('updated', this.cls, this.cid, this.collection, this.dataset);
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
    },
    
    getMaxValue: function () {
      var max, dataset;

      if (this.dataset) {
        if (this.dataset.datasets) {
          dataset = _.map(this.dataset.datasets, function (set) { return set.data; });
          max = _.max(_.flatten(dataset), function (set) { return set; });
        } else {
          max = _.max(this.dataset, function (data) { return data.value; }).value;
        }
      }
      return max;
    },
    
    scaleData: function () {
      var scale = this.getScaleFactor();
      
      if (this.dataset) {
        if (this.dataset.datasets) {
          this.dataset.datasets = _.map(this.dataset.datasets, function (set) { 
            set.data = _.map(set.data, function (data) { 
              return data /= scale;
            });
            return set;
          });
        }
      }
      // console.log(scale, this.dataset);
    },
    
    getScaleFactor: function () {
      var max = this.getMaxValue();

      for (var i = max, ctr = 0; i > 1000; ctr++) {
          i /= 1000;
      }

      this.scale = Math.pow(1000, ctr);
      return this.scale;
    },
    
    render: function (ctx) {
      this.context.scale = this.scale;
      
      this.context.units = (this.collection && this.collection.params && this.collection.params.seconds) ? 'sec' : 'ms';
      ChartView.__super__.render.call(this, ctx);
      return this;
    }
  });
  
  LineChart = ChartView.extend({
    cls: 'LineChart',
    template: LineChartTpl,
    onRender: function () {
      // create chart only if dataset available
      // console.log(this.dataset, this.getMaxValue());
      if (this.dataset) {
        var cnv = this.$("canvas").get(0);
        if (cnv) {
          var ctx = cnv.getContext("2d");
          var myChart = new Chart(ctx).Line(this.dataset, Config);
          // console.log(myChart, this.dataset);
        }
        
        if (myChart) this.$('.legend').html(myChart.generateLegend());
      }
    }
  });
  
  DoughnutChart = ChartView.extend({
    cls: 'DoughnutChart',
    ColorScheme: ColorScheme,
    template: DoughnutChartTpl,
    onRender: function () {
      // create chart only if dataset available
      if (this.dataset) {
        var cnv = this.$("canvas").get(0);
        if (cnv) {
          var ctx = cnv.getContext("2d");
          var myChart = new Chart(ctx).Doughnut(this.dataset, DoughnutConfig);
        }
      }
      if (myChart) {
        var $legend = this.$('.legend').html(myChart.generateLegend());
        // TODO: mouseover events disabled for now - (have to check if it doesn't introduce DOM zombies)
        // $legend.find('li').on('mouseover', function (e) {
        //   var idx = $(e.currentTarget).data('idx');
        //   var seg = myChart.segments[idx];
        //   seg.save();
        //   myChart.showTooltip([seg]);
        //   seg.restore();
        // });
        // $legend.on('mouseout', function () {
        //   myChart.draw()
        // });
      }
        
    }    
  });
  
  return {
    LineChart: LineChart,
    DoughnutChart: DoughnutChart
  };
});
