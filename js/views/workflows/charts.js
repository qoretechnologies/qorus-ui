define(function (require) {
  var _               = require('underscore'),
      utils           = require('utils'),
      Qorus           = require('qorus/qorus'),
      Workflow        = require('models/workflow'),
      StatsCollection = require('collections/stats'),
      ChartView       = require('views/common/chart'),
      Template        = require('tpl!templates/workflow/stats.html'),
      ChartsView;

  ChartsView = Qorus.View.extend({
    template: Template,

    additionalEvents: {
      'click .chart-range': 'editRange'
    },

    initialize: function (opts) {
      this.model_id = opts.model_id;
      this.views = {};
    },
    
    onRender: function () {
      this.drawCharts();
    },
    
    editRange: function (e) {
      var self = this,
        $target = $(e.currentTarget),
        value = $target.data('value'),
        template = EditTemplate({ 
          value: value,
          type: 'text'
        }),
        str = "Last %s day(s)";
        
        $tpl = template;
        $target.removeClass('editable');
        $target.html($tpl);
        
        $('input', $target).focus();
        
        $('button[data-action=cancel]', $target).click(function () {
          $target.html(sprintf(str, value));
          $target.toggleClass('editable');
        });
        
        $('button[data-action=set]').click(function () {
          var val = $(this).prev('input').val();

          _.each($target.data('targets').split(','), function (t) {
            self.updateChart(t, val);
          });

          $target.addClass('editable');
          $target.data('value', val);
          $target.html(sprintf(str, val));
        });
        
        $('input').keypress(function (e) {
          var val = $(this).val();
          if(e.which == 13) {

            _.each($target.data('targets').split(','), function (t) {
              self.updateChart(t, val);
            });

            $target.addClass('editable');
            $target.data('value', val);
            $target.html(sprintf(str, val));
          }
        });
    },
    
    updateChart: function (view, step) {
      var v = this.getView(view);
      
      if (v) {
        v.collection.setStep(step); 
      }
    },
    
    drawCharts: function () {
      // add performance chart subviews
      // window.view = this;
      console.log('drawing charts');
      
      if (!this.getView('#chart-1')) {
        this.setView(
          new ChartView.LineChart(
            { width: 600, height: 200 }, 
            new StatsCollection({ id: this.model_id })
          ), 
          '#chart-1', 
          true
        );

        this.setView(
          new ChartView.DoughnutChart(
            { width: 200, height: 200 }, 
            new Workflow({ id: this.model_id })
          ), 
          '#chart-1-donut',
          true
        );        

        this.setView(
          new ChartView.LineChart(
            { width: 600, height: 200 }, 
            new StatsCollection({ id: this.model_id, step: 7 })
          ),
          '#chart-2', true
        );
          
        this.setView(
          new ChartView.DoughnutChart(
            { width: 200, height: 200 }, 
            new Workflow({ id: this.model_id, date: utils.formatDate(moment().days(-6)) })
          ), 
          '#chart-2-donut', 
          true
        );
        
        this.setView(
          new ChartView.LineChart(
            { width: 600, height: 200 }, 
            new StatsCollection({ id: this.model_id, step: 30 })
          ),
          '#chart-3', 
          true
        );
        
        this.setView(
          new ChartView.DoughnutChart(
            { width: 200, height: 200 }, 
            new Workflow({ id: this.model_id, date: utils.formatDate(moment().days(-30)) })
          ), 
          '#chart-3-donut', 
          true
        );
      }
    },
    
    clean: function () {
      this.undelegateEvents();
      this.stopListening();
      this.remove();
    }
  });
  
  return ChartsView;
});
