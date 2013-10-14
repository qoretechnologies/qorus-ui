define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!../../../templates/workflow/modal.html',
  'jquery.ui'
], function ($, _, Qorus, Template) {
  var View = Qorus.View.extend({
    additionalEvents: {
      'submit': 'startWorkflow',
    },
    
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this, 'render');
      
      this.template = Template;
      
      // init model
      this.model = opts.workflow;
      
      // this.model.fetch();
      // this.model.on('change', this.render);
    },
    
    render: function () {
      var ctx = { item: this.model };
      View.__super__.render.call(this, ctx);
    },
    
    onRender: function () {
      $('[data-toggle="tooltip"]').tooltip();
    },
    
    open: function () {
      this.render();
      $(this.$el).modal();
    },
    
    close: function () {
      this.$el.modal('hide');
    },
    
    // starts workflow with params from form
    startWorkflow: function (e) {
      debug.log("Submit", e);
      e.preventDefault();

      var vals = $(e.target).serializeArray();
      var params = {};
      
      _.each(vals, function (v) {
        params[v.name] = v.value;
      });
      
      this.model.doAction('start', params);
      this.close();
      return this;
    }
    
  });
  return View;
});