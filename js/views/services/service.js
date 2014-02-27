define(function (require) {
  require('jquery.ui');
  
  var $           = require('jquery'),
      Qorus       = require('qorus/qorus'),
      LogView     = require('views/log'),
      ModalView   = require('views/common/modal'),
      LibraryView = require('views/common/library'),
      Template    = require('tpl!templates/service/detail.html'),
      MethodsTpl  = require('tpl!templates/service/methods.html'),
      InfoTpl     = require('tpl!templates/service/info.html'),
      SourceTpl   = require('tpl!templates/service/source.html'),
      AlertsTpl   = require('tpl!templates/common/alerts.html'),
      Rainbow     = require('rainbow'),
      ModelView, MethodsView;
      

  AlertsView = Qorus.ModelView.extend({
    __name__: 'ServiceAlertsPaneView',
    name: 'Alerts',
    template: AlertsTpl
  });

  MethodsView = Qorus.ModelView.extend({
    template: MethodsTpl,
    name: 'Methods',
    additionalEvents: {
      'click button[data-action=showSource]': 'showSource'
    },
    
    initialize: function () {
      MethodsView.__super__.initialize.apply(this, arguments);

      // this.model.getProperty('methods', { method_source: true }, true);
      this.model.getProperty('methods', { method_source: true }, true);
      this.listenTo(this.model, 'update:methods', this.render);
    },
    
    showSource: function (e) {
      var $target = $(e.currentTarget);
      var method = _.where(this.model.get('methods'), { name: $target.data('methodname') })[0];
      
      content_view = new Qorus.View({
        template: SourceTpl,
        method: method
      });
      
      content_view.on('postrender', function () { Rainbow.color() } );
      
      this.removeView('#source-modal');
      
      this.insertView(new ModalView({ 
        content_view: content_view
      }), '#source-modal');
    }
  });

  ModelView = Qorus.TabView.extend({
    template: Template,
    views: {},
    url: function () {
      return "/" + this.model.id;
    },
    
    additionalEvents: {
      "click button[data-action!='execute']": "runAction",
      "click button[data-action='execute']": "openExecuteModal"
    },
    
    initialize: function () {
      ModelView.__super__.initialize.apply(this, arguments);
      
      // TODO: check why this doesn't work
      // this.listenTo(this.model, 'change', this.render);
    },

    render: function (ctx) {
      this.context.item = this.model.toJSON();
      return ModelView.__super__.render.call(this, ctx);
    },
    
    preRender: function () {
      var url = '/services/' + this.model.id;
      
      this.addTabView(new Qorus.ModelView({ model: this.model, template: InfoTpl }), { name: 'Detail'});
      this.addTabView(new LibraryView({ model: this.model }));
      this.addTabView(new MethodsView({ model: this.model }));
      this.addTabView(new LogView({ socket_url: url, parent: this }));
      
      if (this.model.get('has_alerts')) this.addTabView(new AlertsView({ model: this.model }));
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
      this.$el.remove();
    },
    
    close: function () {
      this.trigger('close');
    }
  });
  
  return ModelView;
});
