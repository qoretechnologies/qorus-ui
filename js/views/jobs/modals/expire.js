define([
  'jquery',
  'underscore',
  'settings',
  'utils',
  'qorus/qorus',
  'text!templates/job/modals/expire.html',
  'datepicker'
], function ($, _, settings, utils, Qorus, Template) {
  var View = Qorus.View.extend({
    url: settings.REST_API_PREFIX + '/jobs/',
    context: {},
    additionalEvents: {
      'submit': 'runAction',
    },
    
    initialize: function (opts) {
      _.bindAll(this, 'render');
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
    
    close: function () {
      this.$el.modal('hide');
    },

    datePicker: function () {
      var view = this;
      this.dp = $('.dp').datetimepicker({
          format: 'yyyy-mm-dd hh:ii:ss',
          autoclose: true
      });
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
        .done(function (resp) {
           // $.globalMessenger().post("Job " + id + " set expiry");
        });
          
      this.close();
    },
    
    off: function () {
      this.undelegateEvents();
    }
    
  });
  return View;
});