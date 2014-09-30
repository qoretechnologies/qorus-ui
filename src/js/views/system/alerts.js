define(function (require) {  
  var $          = require('jquery'),
      _          = require('underscore'),
      Backbone   = require('backbone'),
      Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Collection = require('collections/alerts'),
      Template   = require('text!templates/system/alerts/list.html'),
      TableTpl   = require('text!templates/system/alerts/table.html'),
      RowTpl     = require('text!templates/system/alerts/row.html'),
      DetailTpl  = require('text!templates/system/alerts/detail.html'),
      PaneView   = require('views/common/pane'),
      Alert      = require('models/alert'),
      Filtered   = require('backbone.filtered.collection'),
      columns, css_map, DetailView, TableView, ListView, View;
  
  columns = [
    {
      name: 'alert',
      label: 'Alert'
    },
    {
      name: 'object',
      label: 'Object'
    },
    {
      name: 'when',
      label: 'When'
    }
  ];
  
  css_map = {
    'workflow': 'label-warning',
    'service': 'label-important'
  };
  
  DetailView = Qorus.View.extend({
    template: DetailTpl,
    
    initialize: function (opts) {
      if (opts.model) {
        this.model = opts.model;
      }
      
      DetailView.__super__.initialize.call(this, opts);
    },
    
    onProcessPath: function (path) {
      var id = path.split('/')[0];
      
      if (id) this.detail_id = id;
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      DetailView.__super__.render.call(this, ctx);
      return this;
    },

    close: function () {
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    }
  });
  
  TableView = Qorus.TableView.extend({
    update: function () {
      TableView.__super__.update.call(this, false);
    }
  });
  
  ListView = Qorus.ListView.extend({
    __name__: "AlertsListView",
    // tagName: 'div',
    // id: function () {
    //   return "alerts-table-" + this.cid;
    // },
    initialize: function (collection) {
      this.views = {};
      this.context = {};
      this.options = {};
      this.collection = collection;
      
      // this.listenTo(this.collection, 'all', function () { console.log(arguments)} );
    },
    
    template: function () {
      return _.template(sprintf('<div id="alerts-table-%s" />', this.cid));
    },
  
    onProcessPath: function () {
      if (this.path) this.detail_id = this.path;
    },

    preRender: function () {
      var self = this,
          TView;
            
      TView = this.setView(new TableView({ 
        parent: this,
        collection: this.collection, 
        template: TableTpl,
        row_template: RowTpl,
        helpers: this.helpers,
        dispatcher: Dispatcher,
        fixed: true
      }), sprintf('#alerts-table-%s', this.cid));
      
      this.listenTo(TView, 'row:clicked', function (row) {
        self.trigger('row:clicked', row);
      });
    },
    
    onRender: function () {
      ListView.__super__.onRender.apply(this, arguments);
      if (this.detail_id) {
        var m = this.collection.get(this.detail_id);
        if (m) m.trigger('rowClick');
      }
    }
  });

  View = Qorus.TabView.extend({
    url: "/alerts",
    cls: 'AlertsTabView',
    collections: {},
    views: {},
    template: function (ctx) {
      ctx = ctx || {};
      _.extend(ctx, { cid: this.cid });
      return _.template(Template, ctx);
    },
    
    initialize: function () {
      View.__super__.initialize.apply(this, arguments); 
      this.listenTo(Collection, 'sync', this.render);
    },
    
    onProcessPath: function () {
      View.__super__.onProcessPath.apply(this, arguments);
    },
        
    preRender: function () {
      var OView, TView, ongoing, transient;
        
      ongoing = new Filtered(Collection);
      ongoing.filterBy({ alerttype: 'ONGOING' });
      transient = new Filtered(Collection);
      transient.filterBy({ alerttype: 'TRANSIENT' });
      
      OView = this.setView(new ListView(ongoing), sprintf('#alerts-ongoing-list-%s', this.cid));

      TView = this.setView(new ListView(transient), sprintf('#alerts-transient-list-%s', this.cid));
      
      
      this.listenTo(Dispatcher, 'alert:ongoing_raised alert:ongoing_cleared alert:transient_raised', function (e, evt) {
        var alert, id;
        
        if (!e.info.when) e.info.when = e.time;
        
        if (evt === 'alert:ongoing_raised' || evt === 'alert:transient_raised') {
          var type = (evt === 'alert:ongoing_raised') ? 'ONGOING' : 'TRANSIENT';
          
          _.extend(e.info, { alerttype: type });
          alert = new Alert(e.info, { parse: true });
          Collection.add(alert);
        } else if (evt === 'alert:ongoing_cleared') {
          alert = Collection.findWhere({ _id: e.info.id, type: e.info.type, alerttype: 'ONGOING' });
          if (alert) {
            alert.trigger('destroy', alert, alert.collection);
          }
        }
      });
      
      this.listenTo(OView, 'row:clicked', this.showDetail);
      this.listenTo(TView, 'row:clicked', this.showDetail);
      
      OView.url = '/ongoing';
      TView.url = '/transient';
    },
    
    showDetail: function (row) {
      var content_view = new DetailView({ model: row.model }),
          view         = this.getView('.alert-detail'),
          width        = $(document).width() - this.$('[data-sort="object"]').offset().left,
          model        = row.model,
          url          = [this.getViewUrl(), this.active_tab].join('/');
      
      if (this.selected_model != model) {
        row.$el.addClass('info');
        view = this.setView(new PaneView({
          content_view: content_view,
          width: width
        }), '.alert-detail', true);
        this.selected_model = model;
        
        view.render();

        // close detail on model destroy event
        this.listenToOnce(this.selected_model, 'destroy', function () {
          view.close();
        });
        
        this.listenToOnce(view, 'closed off', function () {
          row.$el.removeClass('info');
        });
        
        url = [this.getViewUrl(), this.active_tab, row.model.id].join('/');  
      } else {
        if (view) view.close();
        if (this.selected_model) this.stopListening(this.selected_model);
        this.selected_model = null;
      }
      
      Backbone.history.navigate(url);
    }
  });
  
  return View;
});

