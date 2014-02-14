define(function (require) {
  require('jquery.ui');
  
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Dispatcher  = require('qorus/dispatcher'),
      Model       = require('models/service'),
      LogView     = require('views/log'),
      ModalView   = require('views/services/modal'),
      Template    = require('tpl!templates/service/detail.html'),
      MethodsTpl  = require('tpl!templates/service/methods.html'),
      InfoTpl     = require('tpl!templates/service/info.html'),
      ModelView;

  ModelView = Qorus.TabView.extend({
    template: Template,
    views: {},
    url: function () {
      return "/" + this.model.id;
    },
    
    additionalEvents: {
      "click button[data-action!='execute']": "runAction",
      "click button[data-action='execute']": "openExecuteModal",
    },
    
    initialize: function () {
      ModelView.__super__.initialize.apply(this, arguments);
      
      // TODO: check why this doesn't work
      this.listenTo(this.model, 'change', this.render);
    },

    render: function (ctx) {
      this.context.item = this.model.toJSON();
      return ModelView.__super__.render.call(this, ctx);
    },
    
    preRender: function () {
      var url = '/services/' + this.model.id;
      
      this.addTabView(new Qorus.ModelView({ model: this.model, template: InfoTpl }), { name: 'Info'});
      this.addTabView(new Qorus.ModelView({ model: this.model, template: MethodsTpl }), { name: 'Methods'});
      this.addTabView(new LogView({ socket_url: url, parent: this }));
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
      this.removeViews();
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
