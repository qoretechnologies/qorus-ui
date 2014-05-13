define(function (require) {
  var Qorus       = require('qorus/qorus'),
      Template    = require('tpl!templates/job/meta.html'),
      InfoTpl     = require('tpl!templates/job/info.html'),
      AlertsTpl   = require('tpl!templates/common/alerts.html'),
      LogView     = require('views/log'),
      LibraryView = require('views/common/library'),
      Prism       = require('prism'),
      View, InfoPaneView, CodePaneView, AlertsView;
  
  InfoPaneView = Qorus.ModelView.extend({
    __name__: 'JobInfoPaneView',
    name: 'Details',
    template: InfoTpl,
    initialize: function () {
      InfoPaneView.__super__.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    },
  });
  
  CodePaneView = Qorus.ModelView.extend({
    __name__: 'JobCodePaneView',
    template: "<pre class='language-qore'><code class='language-qore'><%= item.code %></code></pre>",
    name: 'Code',
    initialize: function () {
      CodePaneView.__super__.initialize.apply(this, arguments);
      this.model.getProperty('code');
      this.listenTo(this.model, 'change:code', this.render);
      this.on('postrender', this.color);
    },
    color: function () {
      var self = this;
      Prism.highlightAll();
    }
  });
  
  AlertsView = Qorus.ModelView.extend({
    __name__: 'JobAlertsPaneView',
    name: 'Alerts',
    template: AlertsTpl,
    initialize: function () {
      AlertsView.__super__.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    },
  });
  
  View = Qorus.TabView.extend({
    __name__: 'JobDetail',
    views: {},
    
    url: function () {
      return "/" + this.model.id;
    },
    
    template: Template,
    
    initialize: function (opts) {
      View.__super__.initialize.apply(this, arguments);
      this.opts = opts;
      this.model = opts.model;
      // this.listenTo(this.model, 'change', this.render);
    },

    preRender: function () {
      var url = '/jobs/' + this.model.id;
      
      this.removeView('tabs');
      
      this.addTabView(new InfoPaneView({ model: this.model }));
      this.addTabView(new LibraryView({ model: this.model }));
      this.addTabView(new CodePaneView({ model: this.model }));
      this.addTabView(new LogView({ socket_url: url, parent: this }));
      
      if (this.model.get('has_alerts')) this.addTabView(new AlertsView({ model: this.model }));
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      View.__super__.render.call(this, ctx);
    },
    
    off: function () {
      this.removeViews();
      this.undelegateEvents();
      this.stopListening();
    }
  });    
  return View;
});
