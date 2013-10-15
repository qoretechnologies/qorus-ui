define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'qorus/qorus',
  'text!../../../templates/workflow/toolbars/workflows_toolbar.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect'
], function($, _, Backbone, utils, Qorus, Template, date, moment){
  
  var Toolbar = Qorus.View.extend({
    context: {},
    
    initialize: function (opts) {
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      this.context.date = this.options.date;
      this.template = Template;
      this.getHiddenURL();
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
    
    getHiddenURL: function () {
      var path = utils.getCurrentLocationPath().slice(1);
      var parts = path.split('/');
      
      debug.log(parts.length);
      
      if (parts.length > 2) {
        this.context.url = [parts[0], parts[1]].join('/');
        this.context.deprecated = true;
      } else if (parts.length == 2) {
        this.context.url = [parts[0], parts[1], 'hidden'].join('/');
        this.context.deprecated = false;
      } else {
        this.context.url = [parts[0], '24h', 'hidden'].join('/');
        this.context.deprecated = false;
      }

    }
  });
  
  return Toolbar;
});
