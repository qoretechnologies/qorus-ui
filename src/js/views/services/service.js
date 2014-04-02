define(function (require) {
  require('jquery.ui');
  
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      LogView     = require('views/log'),
      ModalView   = require('views/common/modal'),
      LibraryView = require('views/common/library'),
      Template    = require('tpl!templates/service/detail.html'),
      MethodsTpl  = require('tpl!templates/service/methods.html'),
      InfoTpl     = require('tpl!templates/service/info.html'),
      SourceTpl   = require('tpl!templates/service/source.html'),
      AlertsTpl   = require('tpl!templates/common/alerts.html'),
      Prism       = require('prism'),
      ModelView, MethodsView, AlertsView;
      

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
      var $target = $(e.currentTarget),
          method  = _.where(this.model.get('methods'), { name: $target.data('methodname') })[0],
          content_view, modal;
      
      content_view = new Qorus.View({
        template: SourceTpl,
        method: method
      });
      
      content_view.onRender = function () {
        var el = this.$('pre').get(0);
        _.defer(Prism.highlightElement, el);
      };
      
      this.removeView('#source-modal');
      
      modal = new ModalView({ 
        content_view: content_view
      });
      
      this.insertView(modal, '#source-modal');
    }
  });

  ModelView = Qorus.TabView.extend({
    template: Template,
    url: function () {
      return "/" + this.model.id;
    },
    
    additionalEvents: {
      "click button[data-action!='execute']": "runAction",
      "click button[data-action='execute']": "openExecuteModal"
    },

    render: function (ctx) {
      this.context.item = this.model.toJSON();
      return ModelView.__super__.render.call(this, ctx);
    },
    
    preRender: function () {
      var url = '/services/' + this.model.id,
          dview, lview, mview, logview;
          
      this.removeView('tabs');
      
      dview   = this.addTabView(new Qorus.ModelView({ model: this.model, template: InfoTpl }), { name: 'Detail'});
      
      dview.listenTo(this.model, 'change', dview.render);
      
      lview   = this.addTabView(new LibraryView({ model: this.model }));
      mview   = this.addTabView(new MethodsView({ model: this.model }));
      logview = this.addTabView(new LogView({ socket_url: url, parent: this }));
      
      if (this.model.get('has_alerts')) this.addTabView(new AlertsView({ model: this.model }));
      
      this.listenTo(this.model, 'change:has_alerts', this.render);
    },
    
    runAction: function (evt) {
      var data = $(evt.currentTarget).data();
      this.model.doAction(data.action, data);
    },
    
    openExecuteModal: function (evt) {
      console.log('tada');
      evt.stopPropagation();
      this.trigger('modal:open', this.model, $(evt.currentTarget).data('methodname'));
    },
    
    close: function () {
      this.trigger('close');
    }
  });
  
  return ModelView;
});
