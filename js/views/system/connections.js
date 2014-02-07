define(function (require) {
  var $          = require('jquery'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Template   = require('tpl!templates/system/connections.html'),
      PaneTpl    = require('tpl!templates/system/connections/pane.html'),
      Collection = require('collections/remote'),
      View, PaneView;
  
  PaneView = Qorus.View.extend({
    additionalEvents: {
      'click .nav-list a': 'tabToggle'
    },
    views: {},
    template:  PaneTpl,
    
    initialize: function (options) {
      this.name = options.resource_type;
      this.collection = new Collection({ resource_type: options.resource_type });
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },
    
    preRender: function () {
      this.context.items = this.collection.toJSON();
    },
    
    tabToggle: function (e) {
      var $target = $(e.currentTarget);
      $target.tab('show');
      e.preventDefault();
      e.stopPropagation();
    }
  });
  
  View = Qorus.TabView.extend({
    views: {},
    url: '/remote',
    template: Template,
    preRender: function () {
      this.addTabView(new PaneView({ resource_type: 'datasources' }));
      this.addTabView(new PaneView({ resource_type: 'qorus' }));
      this.addTabView(new PaneView({ resource_type: 'user' }));
    }
  });
  
  return View;
});
