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
  })
  
  TableView = Qorus.TableView.extend({
    initialize: function () {
      _.bindAll(this);
      var self = this;
      TableView.__super__.initialize.apply(this, arguments);
      this.listenTo(Dispatcher, 'alert', function () {
        self.collection.fetch();
      });
    },
        
    onRender: function () {
      TableView.__super__.onRender.call(this);
      this.$('#alert-detail').affix({ offset: 200 });
    }
  });
  
  ListView = Qorus.ListView.extend({
    template: function () {
      return _.template(sprintf('<div id="alerts-table-%s" />', this.cid));
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
    }
  });

  View = Qorus.View.extend({
    collections: {},
    views: {},
    template: function (ctx) {
      ctx = ctx || {};
      _.extend(ctx, { cid: this.cid });
      return _.template(Template, ctx);
    },
    
    preRender: function () {
      var ongoing_v, view_transient;
      
      ongoing_v = this.setView(new ListView(
        new Collection([], { type: 'ongoing'})
      ), sprintf('#alerts-ongoing-list-%s', this.cid));

      transient_v = this.setView(new ListView(
        new Collection([], { type: 'transient'})
      ), sprintf('#alerts-transient-list-%s', this.cid));
      
      this.listenTo(ongoing_v, 'row:clicked', this.showDetail);
      this.listenTo(transient_v, 'row:clicked', this.showDetail);
    },
    
    showDetail: function (row) {
      var content_view = new DetailView({ model: row.model }),
          view         = this.getView('#alert-detail'),
          width        = $(document).width() - $('[data-sort="object"]').offset().left
          model        = row.model;
      
      if (this.selected_model != model) {
        row.$el.addClass('info');
        view = this.setView(new PaneView({
          content_view: content_view,
          width: width
        }), '#alert-detail', true);
        this.selected_model = model;

        this.listenToOnce(view, 'closed off', function () {
          row.$el.removeClass('info');
        });
      } else {
        if (view) view.close();
        this.selected_model = null;
      }
    }
  });
  
  return View;
});

