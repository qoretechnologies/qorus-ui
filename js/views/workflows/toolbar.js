define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!/templates/toolbars/orders.html',
  'datepicker',
  'moment',
], function($, _, Backbone, Qorus, Template, date, moment){
  var Toolbar = Qorus.View.extend({
    context: {
      predefined_statuses: [
        'Ready', 'Scheduled', 'Complete', 'Incomplete', 'Error', 'Canceled', 
        'Retry', 'Waiting', 'Async-Waiting', 'Event-Waiting', 'In-Progress', 
        'Blocked', 'Crash'
      ]
    },
    initialize: function(opts){
      Toolbar.__super__.initialize.call(this, opts);

      this.template = Template;
      this.on('render', this.datePicker, this);
      this.url = this.options.url;

      if (this.options.statuses){
        this.url += '/' + this.options.statuses;
      }
      this.context.url = this.url;
    },
    // filter by date init
    datePicker: function(){
      var view = this;
      $('.dp').datetimepicker({
          format: 'yyyy-MM-dd hh:mm:ss',
      })
      .on('changeDate', function(e){
          view.onDateChanged(e.date.toISOString(), {});
      });
    },
    onDateChanged: function(date) {
      var url = this.url + '/' + moment(date).utc().format('YYYY-MM-DD HH:mm:ss');
      Backbone.history.navigate(url);
    },
  });
  return Toolbar;
});
