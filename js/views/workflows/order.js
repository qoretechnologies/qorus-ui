define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/order',
  'text!../../../templates/workflow/orders/detail.html'
], function($, _, Qorus, Model, Template){
  var ModelView = Qorus.View.extend({
    template: Template,
    
    initialize: function (opts) {
      ModelView.__super__.initialize.call(this, opts);
  	  _.bindAll(this, 'render');
      this.model = new Model({ id: opts.id });
      this.model.fetch();
      this.model.on('change', this.render, this);
    },
    
    render: function (ctx) {
      this.context.item = this.model;
      ModelView.__super__.render.call(this, ctx);
    }
  });
  return ModelView;
});
