define(function (require) {
  var $          = require('jquery'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Template   = require('tpl!templates/system/connections.html'),
      PaneTpl    = require('tpl!templates/system/connections/pane.html'),
      TableTpl   = require('text!templates/system/connections/table.html'),
      RowTpl     = require('text!templates/system/connections/row.html'),
      Collection = require('collections/remote'),
      View, PaneView, TableView;

  
  TableView = Qorus.TableView.extend({
    template: TableTpl,
    row_template: RowTpl,
    fixed: true,
    appendRow: function () {
      var view = TableView.__super__.appendRow.apply(this, arguments);
      view.render();
      console.log(view.$el);
      return view;
    }
  });
  
  PaneView = Qorus.ListView.extend({
    views: {},
    template:  PaneTpl,
    
    initialize: function (options) {
      this.name = options.resource_type;
      this.collection = new Collection([], { resource_type: options.resource_type });
      this.collection.fetch();
      this.render();
    },
    
    preRender: function () {
      this.context.items = this.collection.toJSON();
      this.setView(new TableView({
        collection: this.collection,
      }), '.connections');
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
