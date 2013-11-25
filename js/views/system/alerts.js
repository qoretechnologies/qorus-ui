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
    
    rowClick: function (model, e) {
      var view;
      
      this.$('.info').removeClass('info');
      
      if (this.selected_model != model) {
        view = this.setView(new DetailView({
          model: model
        }), '#alert-detail', true);
        $(e.currentTarget).addClass('info');
        this.selected_model = model;
      } else {
        this.removeView('#alert-detail');
        this.selected_model = null;
      }
      
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
      this.setView(new TableView({ 
        parent: this,
        collection: this.collection, 
        template: TableTpl,
        row_template: RowTpl,
        helpers: this.helpers,
        dispatcher: Dispatcher,
        fixed: true
      }), sprintf('#alerts-table-%s', this.cid));
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
      this.setView(new ListView(
        new Collection([], { type: 'ongoing'})
      ), sprintf('#alerts-ongoing-list-%s', this.cid));

      this.setView(new ListView(
        new Collection([], { type: 'transient'})
      ), sprintf('#alerts-transient-list-%s', this.cid));
    }
  });
  
  return View;
});

