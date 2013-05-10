define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/service',
  'text!../../../templates/service/detail.html',
  'jquery.ui'
], function ($, _, Qorus, Model, Template) {
  var ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle',
    },
    
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this, 'render');
      
      this.template = Template;
      
      // init model
      this.model = new Model({ id: opts.id });
      this.model.fetch();
      this.model.on('change', this.render);
    },

    render: function (ctx) {
      this.context.item = this.model;
      ModelView.__super__.render.call(this, ctx);
      this.onRender();
    }, 

    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');
    }
  });
  
  return ModelView;
});