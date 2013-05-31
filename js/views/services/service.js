
define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/service',
  'text!../../../templates/service/detail.html',
  'jquery.ui'
], function ($, _, Qorus, Dispatcher, Model, Template) {
  var ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle',
    },
    
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this);
      
      this.template = Template;
      
      if (_.has(opts, 'context')) {
        _.extend(this.context, opts.context);
      }
      
      // init model
      this.model = new Model({ id: opts.id });
      this.model.fetch();
      
      this.listenTo(Dispatcher, 'service:start service:error service:stop', this.model.fetch);
      this.model.on('sync', this.render);
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