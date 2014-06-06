define(function (require) {
  require('jquery.ui');
  require('bootstrap.multiselect');
  
  var $          = require('jquery'),
      _          = require('underscore'),
      Backbone   = require('backbone'),
      Qorus      = require('qorus/qorus'),
      DatePicker = require('views/common/datetimepicker'),
      utils      = require('utils'),
      helpers    = require('qorus/helpers'),
      moment     = require('moment'),
      BaseToolbar;
    
  BaseToolbar = Qorus.View.extend({
    defaultEvents: {
      'click .dp': 'datePicker',
      'keypress .dp input': 'submitDate'
    },
    
    url_options: {},
    
    datepicker: false,
    fixed: true,
    
    initialize: function (opts) {
      // _.bindAll(this);
      BaseToolbar.__super__.initialize.call(this, opts);
      this.context = {};
      
      this.context.date = this.options.date;
      this.context.query = _.result(utils.parseQuery(Backbone.history.fragment), 'q');
      
      if (this.collection)
        this.listenTo(this.collection, 'sync', this.update);
    },
    
    onRender: function () {
      _.defer($.proxy(this.setFixed, this));
    },
    
    update: function () {
      this.options.date = this.context.date = this.collection.opts.date;
      this.context.query = _.result(utils.parseQuery(Backbone.history.fragment), 'q');
      this.render();
    },
    
    setFixed: function () {
      if (this.fixed && this.$el.next('.push').length == 0) {
        var $push = $('<div class="push" />').height(this.$el.outerHeight(true));

        this.$el
          .width(function () { return $(this).width(); })
          .css('position', 'fixed')
          .after($push);
      
        // bind resize on window size change
        $(window).on('resize.toolbar.' + this.cid, $.proxy(this.resize, this));
      }
    },
        
    resize: function () {
      // reset width of fixed el
      this.$el.width(function () { return $(this).parent().width(); });
    },
    
    clean: function () {
      // unbind window resize event
      $(window).off('resize.toolbar.' + this.cid);
    },
    
    // filter by date init
    datePicker: function (e) {
      if (this.views.datepicker)
        this.views.datepicker.off();
        
      var view = this.views.datepicker = new DatePicker({ date: this.options.date });
      this.listenTo(view, 'applyDate', this.applyDate);
      view.show(e);
    },
    
    showDatePicker: function (e) {},
    
    applyDate: function (date) {
      var options = _.result(this, 'url_options'), 
          url;
      
      // check if valid date
      if (!moment(date).isValid()) return false;
      
      date = utils.encodeDate(date);
      _.extend(options, { date: date });

      if (this.route) {
        url = helpers.getUrl(this.route, options);
        Backbone.history.navigate(url, {trigger: true});
      }
    },
    
    submitDate: function (e) {
      var $target = $(e.currentTarget);

      if (e.keyCode === 13) {
        e.preventDefault();
        this.applyDate($target.val());
      }
    },
    
    hideDatePicker: function (e) {
      if (this.views.datepicker) this.views.datepicker.hide(e);
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
