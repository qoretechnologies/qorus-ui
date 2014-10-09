define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/job/modals/expire.html'),
      DatePicker = require('views/common/datetimepicker'),
      View;
      
  View = Qorus.View.extend({
    url: settings.REST_API_PREFIX + '/jobs/',
    context: {},
    views: {},
    additionalEvents: {
      'click .dp': 'showDatePicker',
      'click [data-dismiss]': 'close',
      'submit': 'runAction'
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.template = Template;

      this.opts = opts;
      _.extend(this.context, opts);
    },
        
    onRender: function () {
      $(this.$el).modal();
      this.datePicker();
    },
    
    render: function (ctx) {
      var item = this.opts.job;
      
      _.extend(this.context, { item: item });
      
      View.__super__.render.call(this, ctx);
      
      return this;
    },
    
    open: function () {
      $(this.$el).modal();
    },
    
    closeView: function () {
      this.views.datepicker.hide();
      this.$el.modal('hide');
    },

    datePicker: function () {
      this.views.datepicker = new DatePicker({ date: this.opts.date });
    },
    
    showDatePicker: function (e) {
      if (this.views.datepicker) this.views.datepicker.toggle(e);
      e.stopPropagation();
    },
    
    runAction: function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var $form = $(ev.target);
      var id = $('#jobid', $form).val();
      var url = this.url + id;

      var params = { 
        action: 'setExpire', 
        date: $('#expiry_date', $form).val()
      };
      
      $.put(url, params)
        .done(function () {
           // $.globalMessenger().post("Job " + id + " set expiry");
        });
          
      this.closeView();
    },
    
    close: function () {
      this.undelegateEvents();
    }
    
  });
  return View;
});
