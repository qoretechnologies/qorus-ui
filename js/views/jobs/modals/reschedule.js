define([
  'jquery',
  'underscore',
  'settings',
  'qorus/qorus',
  'text!../../../../templates/job/modals/reschedule.html',
  'datepicker'
], function ($, _, settings, Qorus, Template) {
  var View = Qorus.View.extend({
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
    
    runAction: function () {
      console.log('run action');
      this.close();
    },
    
    off: function () {
      this.undelegateEvents();
    }
    
  });
  return View;
});