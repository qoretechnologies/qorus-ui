define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'qorus/qorus',
  'datepicker',
  'moment',
  'bootstrap.multiselect'
], function($, _, Backbone, utils, Qorus, date, moment){
  
  var BaseToolbar = Qorus.View.extend({
    datepicker: false,
    context: {},
    fixed: true,
    
    initialize: function (opts) {
      _.bindAll(this);
      BaseToolbar.__super__.initialize.call(this, opts);
      
      this.context.date = this.options.date;
    },
    
    onRender: function () {
      if (this.datepicker) {
        this.datePicker();
      }
      
      // fix header
      if (this.fixed) {
        var $push = $('<div class="push" />').height(this.$el.outerHeight(true));

        this.$el
          .width(function () { return $(this).parent().width(); })
          .css('position', 'fixed')
          .after($push);
      
        // bind resize on window size change
        $(window).on('resize.toolbar.' + this.cid, this.resize);
      }
    },
    
    resize: function () {
      // reset width of fixed el
      this.$el.width(function () { return $(this).parent().width(); });
    },
    
    clean: function () {
      if (this.dp) {
        this.dp.datetimepicker('destroy');
      }
      // unbind window resize event
      $(window).off('resize.toolbar.' + this.cid);
    },
    
    // filter by date init
    datePicker: function () {
      var view = this;
      this.dp = $('.dp').datetimepicker({
          format: 'yyyy-MM-dd HH:mm:ss',
          autoclose: true
      });
      this.dp.on('changeDate', function (e) {
        $(this).datetimepicker('destroy');
        view.onDateChanged(e.date.toISOString(), {});
      });
    },
    
    onDateChanged: function (date) {
      // remove datepicker
      this.clean();

      // trigger new route
      if (this.url) {
        Backbone.history.navigate(this.url + moment(date).utc()
            .format('YYYYMMDDHHmmss'), {trigger: true});        
      }
    },
    
    navigateTo: function (e) {
      var el = $(e.currentTarget);
      if (el.data('url')) {
        Backbone.history.navigate(el.data('url'), {trigger: true});       
      }
    }
  });
  
  return BaseToolbar;
});
