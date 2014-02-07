define(function (require) {
  var _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Template   = require('tpl!templates/system/connections.html'),
      PaneTpl    = require('tpl!templates/system/connections/pane.html'),
      Collection = require('collections/remote'),
      View, PaneView;
  
  PaneView = Qorus.View.extend({
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
