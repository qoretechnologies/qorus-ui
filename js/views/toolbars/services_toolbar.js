define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!../../../templates/service/toolbars/service_toolbar.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect'
], function($, _, Backbone, Qorus, Template, date, moment){
  var Toolbar = Qorus.View.extend({
    context: {},
    
    events: {
      // "click button.date": "setDate",
      // "click button[data-action='open']": "navigateTo"
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
    
    clean: function () {
      this.$('.sticky').sticky('remove');
      $('.datetimepicker').remove();
      this.dp.remove();
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
    },
    
    navigateTo: function (e) {
      var el = $(e.currentTarget);
      if (el.data('url')) {
        Backbone.history.navigate(el.data('url'), {trigger: true});       
      }
    }
  });
  return Toolbar;
});
