
define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/service',
  'views/log',
  'text!../../../templates/service/detail.html',
  'jquery.ui'
], function ($, _, Qorus, Dispatcher, Model, LogView, Template) {
  var ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": "tabToggle",
      "close": "close"
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
      
      this.listenTo(Dispatcher, 'service:start service:error service:stop', function (e, obj) {
        console.log(e, obj);
      });
      this.model.on('sync', this.render);

      this.createSubviews();
    },

    render: function (ctx) {
      this.context.item = this.model;
      ModelView.__super__.render.call(this, ctx);
    }, 

    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');
      console.log(active, $target);
      this.active_tab = active;
    },
    
    createSubviews: function () {
      var url = '/services/' + this.model.id;
      this.subviews.log = new LogView({ socket_url: url });
    },
    
    onRender: function () {
      this.assign('#log', this.subviews.log);
    },
    
    clean: function () {
      console.log("Cleaning", this, this.subviews, this.subviews.log, this.subviews.log.sss);
      if (this.subviews.log) {
        this.subviews.log.clean();
      }
      this.undelegateEvents();
      this.stopListening();
    },
    
    close: function () {
      this.$el.parent()
        .removeClass('show')
        .data('id', null);

      this.clean();
    }
    
  });
  
  return ModelView;
});
