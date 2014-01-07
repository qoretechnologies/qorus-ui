define(function (require) {
  var $          = require('jquery'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Model      = require('models/service'),
      LogView    = require('views/log'),
      ModalView   = require('views/services/modal'),
      Template   = require('text!templates/service/detail.html'),
      ModelView; 

  require('jquery.ui');

  ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": "tabToggle",
      "click button[data-action!='execute']": "runAction",
      "click button[data-action='execute']": "openExecuteModal",
    },
    
    initialize: function (opts) {
      this.opts = opts;
      this.views = {};
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
      
      // TODO: check why this doesn't work
      this.listenTo(this.model, 'change', this.render);
    },

    render: function (ctx) {
      this.context.item = this.model.toJSON();
      ModelView.__super__.render.call(this, ctx);
    },
    
    preRender: function () {
      var url = '/services/' + this.model.id,
          log = this.setView(new LogView({ socket_url: url, parent: this }), '#log');
      
      if (this.active_tab) {
        this.$('a[href='+ this.active_tab + ']').tab('show');
      }
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
    
    runAction: function (evt) {
      var data = $(evt.currentTarget).data();
      this.model.doAction(data.action, data);
    },
    
    openExecuteModal: function (evt) {
      evt.stopPropagation();
      this.trigger('modal:open', this.model, $(evt.currentTarget).data('methodname'));
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
