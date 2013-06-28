define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!../../../templates/workflow/toolbars/workflows_toolbar.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect'
], function($, _, Backbone, Qorus, Template, date, moment){
  var Toolbar = Qorus.View.extend({
    context: {
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      this.context.date = this.options.date;
      this.template = Template;
    },
    
    onRender: function () {
      this.datePicker();
      $('.sticky').sticky();
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
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
      $('.datetimepicker').remove();
      this.dp.remove();
      Backbone.history.navigate('/workflows/' + moment(date).utc()
          .format('YYYYMMDDHHmmss'), {trigger: true});
    }
  });
  
  return Toolbar;
});
