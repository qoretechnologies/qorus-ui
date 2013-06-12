define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/system',
  'text!../../../templates/system/options.html'
], function($, _, Backbone, Qorus, System, Template){
  var ModelView = Qorus.View.extend({
    initialize: function (opts) {
      ModelView.__super__.initialize.call(this, opts);
      
      this.model = System.Options;
      this.template = Template;
 
      this.model.fetch();
      this.listenToOnce(this.model, 'sync', this.render);
    },
    
    render: function (ctx) {
      var mctx = { item: this.model };
      if (ctx){
        _.extend(mctx, ctx);
      }
      ModelView.__super__.render.call(this, mctx);
      return this;
    },
    
  });
  
  return ModelView;
});