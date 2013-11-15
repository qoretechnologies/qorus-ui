define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'settings',
  'qorus/dispatcher',
  'collections/alerts',
  'text!../../../templates/system/alerts/list.html',
  'text!../../../templates/system/alerts/table.html',
  'text!../../../templates/system/alerts/row.html',
  'text!../../../templates/system/alerts/detail.html'
], function($, _, Backbone, Qorus, settings, Dispatcher, Collection, Template, TableTpl, RowTpl, DetailTpl){
  var columns = [
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
  
  var css_map = {
    'workflow': 'label-warning',
    'service': 'label-important'
  };
  
  var DetailView = Qorus.View.extend({
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
  
  var TableView = Qorus.TableView.extend({
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
  
  var ListView = Qorus.ListView.extend({
    template: '<div id="alerts-table" />',
    
    preRender: function () {
      this.setView(new TableView({ 
        parent: this,
        collection: this.collection, 
        template: TableTpl,
        row_template: RowTpl,
        helpers: this.helpers,
        dispatcher: Dispatcher,
        // fixed: true
      }), '#alerts-table');
    }
  });

  var View = Qorus.View.extend({
    collections: {},
    views: {},
    template: Template,
    
    preRender: function () {
      this.setView(new ListView(
        new Collection([], { type: 'ongoing'})
      ), '#alerts-ongoing-list');

      this.setView(new ListView(
        new Collection([], { type: 'transient'})
      ), '#alerts-transient-list');
    },
    
    onRender: function () {
      console.log(this.$el);
    }
  });
  
  return View;
});

