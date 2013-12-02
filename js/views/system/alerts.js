define(function (require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Qorus = require('qorus/qorus'),
    settings = require('settings'),
    Dispatcher = require('qorus/dispatcher'),
    Collection = require('collections/alerts'),
    Template = require('text!templates/system/alerts/list.html'),
    TableTpl = require('text!templates/system/alerts/table.html'),
    RowTpl = require('text!templates/system/alerts/row.html'),
    DetailTpl = require('text!templates/system/alerts/detail.html'),
    PaneView = require('views/common/pane'),
    Alert = require('models/alert'),
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
    
    onRender: function (ctx) {
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      DetailView.__super__.render.call(this, ctx);
    },

    off: function () {
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    }
  });
  
  TableView = Qorus.TableView;
  
  ListView = Qorus.ListView.extend({
    views: {},
    additionalEvents: {
      "shown": "onShown"
    },
    template: function () {
      return _.template(sprintf('<div id="alerts-table-%s" />', this.cid));
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.views = {};
      ListView.__super__.initialize.call(this, opts);
      this.on('shown', this.onShown);
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
    
    onShown: function () {
      _.each(this.views, function (view) {
        view.trigger('shown');
      })
    }
  });

  View = Qorus.View.extend({
    additionalEvents: {
      "shown": "onShown"
    },
    collections: {},
    views: {},
    template: function (ctx) {
      ctx = ctx || {};
      _.extend(ctx, { cid: this.cid });
      return _.template(Template, ctx);
    },
    
    initialize: function () {
      this.views = {};
      _.bindAll(this);
      View.__super__.initialize.apply(this, arguments);
    },
    
    preRender: function () {
      var OView, TView;
      
      OView = this.setView(new ListView(
        new Collection([], { type: 'ongoing'})
      ), sprintf('#alerts-ongoing-list-%s', this.cid));
      
      OView.listenTo(Dispatcher, 'alert:ongoing_raised alert:ongoing_cleared', function (e, evt) {
        var alert;
        if (!e.info.when) e.info.when = e.time;
        
        if (evt === 'alert:ongoing_raised') {
          alert = new Alert(e.info, { parse: true });
          OView.collection.add(alert);          
        } else if (evt === 'alert:ongoing_cleared') {
          OView.collection.get(e.info.id).destroy();
        }
      });

      TView = this.setView(new ListView(
        new Collection([], { type: 'transient'})
      ), sprintf('#alerts-transient-list-%s', this.cid));
      
      TView.listenTo(Dispatcher, 'alert:transient_raised', function (e, evt) {
        var alert;
        if (!e.info.when) e.info.when = e.time;
      
        alert = new Alert(e.info, { parse: true });
        TView.collection.add(alert);
      });
      
      this.listenTo(OView, 'row:clicked', this.showDetail);
      this.listenTo(TView, 'row:clicked', this.showDetail);
    },
    
    showDetail: function (row) {
      var content_view = new DetailView({ model: row.model }),
          view         = this.getView('.alert-detail'),
          width        = $(document).width() - this.$('[data-sort="object"]').offset().left
          model        = row.model;
      
      if (this.selected_model != model) {
        row.$el.addClass('info');
        view = this.setView(new PaneView({
          content_view: content_view,
          width: width
        }), '.alert-detail', true);
        this.selected_model = model;

        this.listenToOnce(view, 'closed off', function () {
          row.$el.removeClass('info');
        });
      } else {
        if (view) view.close();
        this.selected_model = null;
      }
    },
    
    onShown: function () {
      _.each(this.views, function (view, idx) {
        view.trigger('shown');
      });
    }
  });
  
  return View;
});

