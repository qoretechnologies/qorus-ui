define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/group',
  'text!../../../templates/groups/detail.html'
], function ($, _, Qorus, Dispatcher, Model, Template) {
  var ModelView = Qorus.View.extend({
    title: "Group",
    template: Template,
    
    initialize: function (opts) {
      _.bindAll(this); 
      ModelView.__super__.initialize.call(this, opts);
      
      this.model = new Model({ name: opts.name });
      this.listenTo(this.model, 'change', this.render);
      this.model.fetch();
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      ModelView.__super__.render.call(this, ctx);
      console.log(this.model, this.$el, this.template);
    }
  });
  
  return ModelView;
});