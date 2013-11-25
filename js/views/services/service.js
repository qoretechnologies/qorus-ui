define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/service',
  'views/log',
  'text!templates/service/detail.html',
  'jquery.ui'
], function ($, _, Qorus, Dispatcher, Model, LogView, Template) {
  var ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": "tabToggle",
      "click a.close-detail": "close"
    },
    
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this);
      
      this.template = Template;
      
      if (_.has(opts, 'context')) {
        _.extend(this.context, opts.context);
      }
      
      // init model
      if (_.has(opts, "model")) {
        this.model = opts.model;
      } else if (_.has(opts, "id")) {
        this.model = new Model({ id: opts.id });
        this.model.fetch();        
      } else {
        this.model = new Model();
      }
      
      this.listenTo(this.model, 'change', this.render);
      
    },

    render: function (ctx) {
      this.context.item = this.model;
      ModelView.__super__.render.call(this, ctx);
    }, 

    tabToggle: function(e){
      var $target = $(e.currentTarget),
        view, active, target_name;

      e.preventDefault();

      active = $('.tab-pane.active');
      target_name = $target.data('target') || $target.attr('href')
      $target.tab('show');
      
      view = this.getView(target_name);
      if (view) view.trigger('show');

      this.active_tab = target_name;
    },
    
    preRender: function () {
      var url = '/services/' + this.model.id;
      var log = this.setView(new LogView({ socket_url: url, parent: this }), '#log');
      
      if (this.active_tab) {
        this.$('a[href='+ this.active_tab + ']').tab('show');
      }
    },
    
    off: function () {
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    },
    
    close: function () {
      this.trigger('close');
    }
    
  });
  
  return ModelView;
});
