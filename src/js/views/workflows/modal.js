define(function (require) {
  var $ = require('jquery'),
      _ = require('underscore'),
      Qorus = require('qorus/qorus'),
      Template = require('text!templates/workflow/modal.html'),
      View;
  
  require('jquery-ui');
  
  View = Qorus.View.extend({
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
      return this;
    },
    
    onRender: function () {
      $('[data-toggle="tooltip"]').tooltip();
    },
    
    open: function () {
      this.render();
      $(this.$el).modal();
    },
    
    closeView: function () {
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
      this.closeView();
      return this;
    }
    
  });
  return View;
});