define(function (require) {
  var $             = require('jquery'),
      _             = require('underscore'),
      Qorus         = require('qorus/qorus'),
      Template      = require('tpl!templates/system/connections.html'),
      PaneTpl       = require('tpl!templates/system/connections/pane.html'),
      TableTpl      = require('text!templates/system/connections/table.html'),
      RowTpl        = require('text!templates/system/connections/row.html'),
      RPView        = require('views/common/pane'),
      Collection    = require('collections/remote'),
      QorusTpl      = require('tpl!templates/system/connections/qorus.html'),
      UserTpl       = require('tpl!templates/system/connections/qorus.html'),
      DatasourceTpl = require('tpl!templates/system/connections/qorus.html'),
      AlertsTpl     = require('tpl!templates/common/alerts.html'),
      TabTpl        = require('tpl!templates/system/connections/tabview.html'),
      View, PaneView, TableView, ResourceViews, QorusDetailView, 
      UserDetailView, DatasourcesDetailView;
  
     
      
  QorusDetailView = Qorus.TabView.extend({
    views: {},
    template: TabTpl,
    
    initialize: function (options) {
      QorusDetailView.__super__.initialize.apply(this, arguments);
      this.model = options.model;
    },
    
    preRender: function () {
      this.context.item = this.model.toJSON();
      this.context.item.description = this.context.item.desc;
      
      this.addTabView(new Qorus.ModelView({
        model: this.model,
        template: QorusTpl
      }), { name: 'Detail' });
      
      if (this.model.get('has_alerts')) {
        this.addTabView(new Qorus.ModelView({
          model: this.model,
          template: AlertsTpl
        }), { name: 'Alerts' });
      }
      
      console.log(this.model.get('has_alerts'), this.views);
    }
  });

  UserDetailView = DatasourcesDetailView = QorusDetailView;

  ResourceViews = {
    'qorus': QorusDetailView,
    'user': UserDetailView,
    'datasources': DatasourcesDetailView
  };
  
  
  // Resource Table and Rows defintions
  
  RowView = Qorus.RowView.extend({
    additionalEvents: {
      'click [data-action=ping]': 'doPing'
    },
    
    doPing: function () {

    }
  });
  
  TableView = Qorus.TableView.extend({
    template: TableTpl,
    row_template: RowTpl,
    fixed: true,
    appendRow: function () {
      var view = TableView.__super__.appendRow.apply(this, arguments);
      view.render();
      return view;
    }
  });
  
  // Resource pane definition
  
  PaneView = Qorus.View.extend({
    views: {},
    template:  PaneTpl,
    url: function () {
      return "/" + this.options.resource_type;
    },
    
    initialize: function (options) {
      this.views = {};
      this.options = options || {};
      this.name = options.resource_type;
      this.collection = new Collection([], { resource_type: options.resource_type });
      
      this.listenToOnce(this.collection, 'sync', this.triggerDetail);
      
      this.collection.fetch();

      this.processPath();
      this.render();
    },
    
    preRender: function () {
      this.context.items = this.collection.toJSON();

      var TView = this.setView(new TableView({
        collection: this.collection
      }), '.connections');
      
      this.listenTo(TView, 'row:clicked', this.showDetail);
    },
    
    onProcessPath: function () {
      if (this.path) this.detail_id = this.path;
    },
    
    showDetail: function (row) {
      this.trigger('rowClicked', row, this);
    },
    
    triggerDetail: function () {
      var m; 
        
      if (this.detail_id) {
        m = this.collection.findWhere({ name: this.detail_id });
        if (m) m.trigger('rowClick');
      }
    }
  });
  
  
  // Main connections View
  View = Qorus.TabView.extend({
    views: {},
    url: '/remote',
    template: Template,
    
    preRender: function () {
      var types = ['datasources', 'qorus', 'user'];
      
      _.each(types, function (type) {
        var view = this.addTabView(new PaneView({ resource_type: type }));
        this.listenTo(view, 'rowClicked', this.showDetail);
      }, this);
    },
    
    onProcessPath: function () {
      View.__super__.onProcessPath.apply(this, arguments);
      if (this.path) this.detail_id = this.path;
    },
    
    showDetail: function (row, source_view) {
      var model = row.model,
          view  = this.getView('.detail'),
          width = $(document).width() - source_view.$('[data-sort="description"]').offset().left,
          url   = this.getViewUrl();
                
      if (this.selected_model != model) {
        row.$el.addClass('info');
        
        view = this.setView(new RPView({
          content_view: new ResourceViews[source_view.options.resource_type]({ model: model }),
          width: width
        }), '.detail', true);
        this.selected_model = model;

        this.listenTo(this.selected_model, 'change', view.render);
        
        this.listenToOnce(view, 'closed off', function () {
          row.$el.removeClass('info');
        });
        url = [this.getViewUrl(), source_view.url(), row.model.get('name')].join('/').replace(/\/+/g, "/");
      } else {
        if (view) view.close();
        if (this.selected_model) this.stopListening(this.selected_model);
        
        this.selected_model = null;
      }
      
      Backbone.history.navigate(url);
    },
    
    tabToggle: function () {
      View.__super__.tabToggle.apply(this, arguments);
      var view = this.getView('.detail');
      if (view) view.close();
    }
  });
  
  return View;
});
