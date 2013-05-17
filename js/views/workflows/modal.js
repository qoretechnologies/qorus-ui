define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!../../../templates/workflow/modal.html',
  'jquery.ui'
], function ($, _, Qorus, Template) {
  var View = Qorus.View.extend({
    // additionalEvents: {
    //   "click .nav-tabs a": 'tabToggle',
    // },
    // 
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
    
    open: function () {
      this.render();
      $(this.$el).modal();
      console.log('open');
    }
    
  });
  return View;
});