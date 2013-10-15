define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!../../../templates/job/toolbars/jobs_toolbar.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect'
], function($, _, Backbone, Qorus, Template, date, moment){
  var Toolbar = Qorus.View.extend({
    context: {
    },
    
    events: {
      // "click button.date": "setDate",
      // "click button[data-action='open']": "navigateTo"
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      debug.log("Job toolbar", this.options, opts);
      
      this.context.date = this.options.date;
      this.template = Template;
    },
    
    onRender: function () {
      this.datePicker();
      this.$('.sticky').sticky();
      this.$('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    },
    
    // filter by date init
    datePicker: function () {
      var view = this;
      this.dp = $('.dp').datetimepicker({
          format: 'yyyy-mm-dd hh:ii:ss',
          autoclose: true
      });
      this.dp.on('changeDate', function (e) {
        view.onDateChanged(e.date.toISOString(), {});
      });
    },
    
    onDateChanged: function (date) {
      this.$('.datetimepicker').remove();
      this.dp.remove();
      Backbone.history.navigate('/jobs/' + moment(date).utc()
          .format('YYYYMMDDHHmmss'), {trigger: true});
    },
    
    navigateTo: function (e) {
      var el = $(e.currentTarget);
      if (el.data('url')) {
        Backbone.history.navigate(el.data('url'), {trigger: true});       
      }
    },
    
    clean: function () {
      this.$('.datetimepicker').remove();
      this.dp.remove();
      this.$('.sticky').sticky('remove');
    }
  });
  return Toolbar;
});
