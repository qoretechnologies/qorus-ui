define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!/templates/workflow/toolbars/workflows_toolbar.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect'
], function($, _, Backbone, Qorus, Template, date, moment){
  var Toolbar = Qorus.View.extend({
    context: {
    },
    events: {
      // "click button.date": "setDate",
      "click button[data-action='open']": "navigateTo"
    },
    initialize: function(opts){
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      console.log(this.options, this.opts);
      this.context.date = this.options.date;
      this.template = Template;
      this.on('render', this.datePicker, this);
      this.on('render', function(e, o){ $('.sticky').sticky(); });
    },
    // filter by date init
    datePicker: function(){
      var view = this;
      this.dp = $('.dp').datetimepicker({
          format: 'yyyy-mm-dd hh:mm:ss',
      });
      this.dp.on('changeDate', function(e){
        view.onDateChanged(e.date.toISOString(), {});
      });
    },
    onDateChanged: function(date) {
      $('.datetimepicker').remove();
      this.dp.remove();
      Backbone.history.navigate('/workflows/' + moment(date).utc()
          .format('YYYY-MM-DD HH:mm:ss'), {trigger: true});
    },
    navigateTo: function(e){
      var el = $(e.currentTarget);
      if (el.data('url')){
        Backbone.history.navigate(el.data('url'), {trigger: true});       
      }
    }
  });
  return Toolbar;
});
