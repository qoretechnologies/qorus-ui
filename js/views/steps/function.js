define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/function',
  'text!../../../templates/steps/function_modal.html',
], function ($, _, Qorus, Model, Template) {
  var ModelView = Qorus.View.extend({
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
      ModelView.__super__.render.call(this, ctx);
    }
  });
  return ModelView;
});