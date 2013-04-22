define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/function',
  'text!../../../templates/steps/function_modal.html',
], function ($, _, Qorus, Function, Template) {
  var ModelView = Qorus.View.extend({
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this, 'render');
      
      this.template = Template;
      
      // init model
      this.model = new Function({ id: opts.id });
      this.model.fetch();
      this.model.on('change', this.render);
      this.on('render', $(this.el).modal());
    }
  });
  return ModelView;
});