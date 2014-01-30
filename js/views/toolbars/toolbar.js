define(function (require) {
  require('bootstrap.multiselect');
  
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      DatePicker  = require('views/common/datetimepicker'),
      BaseToolbar;
    
  BaseToolbar = Qorus.View.extend({
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
      var el = this.$el.selector + ' .dp';
      var view = this.setView(new DatePicker({ date: this.options.date, element: el }), '.datepicker-container', true);

      this.listenTo(view, 'onSubmit', function () { console.log(arguments); });
    },
    
    showDatePicker: function (e) {
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
