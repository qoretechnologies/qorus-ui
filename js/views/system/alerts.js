define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'settings',
  'collections/alerts',
  'text!../../../templates/system/alerts/list.html',
  'text!../../../templates/system/alerts/table.html',
  'text!../../../templates/system/alerts/row.html',
  'text!../../../templates/system/alerts/detail.html'
], function($, _, Backbone, Qorus, settings, Collection, Template, TableTpl, RowTpl, DetailTpl){
  var columns = [
    {
      name: 'alert',
      label: 'Alert'
    },
    {
      name: 'auditid',
      label: 'Audit ID'
    },
    {
      name: 'id',
      label: 'ID'
    },
    {
      name: 'instance',
      label: 'Instance'
    },
    {
      name: 'local',
      label: 'Local',
      type: 'bool'
    },
    {
      name: 'name',
      label: 'Name'
    },
    {
      name: 'object',
      label: 'Object'
    },
    {
      name: 'reason',
      label: 'Reason'
    },
    {
      name: 'source',
      label: 'Source'
    },
    {
      name: 'type',
      label: 'Type'
    },
    {
      name: 'version',
      label: 'Version'
    },
    {
      name: 'when',
      label: 'When'
    },
    {
      name: 'who',
      label: 'Who'
    }
  ];
  
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

  var View = Qorus.View.extend({
    collections: {},
    views: {},
    template: Template,
    
    initialize: function () {
      View.__super__.initialize.call(this, arguments);
      this.collections.ongoing = new Collection([], { type: 'ongoing' });
      this.collections.transient = new Collection([], { type: 'transient '});
      
      _.each(this.collections, function (c) {
        c.fetch();
      });
    },
    
    preRender: function () {
      this.setView(new TableView({ 
        parent: this,
        collection: this.collections.ongoing, 
        template: TableTpl,
        row_template: RowTpl,
        helpers: this.helpers,
        context: { url: this.url },
        dispatcher: Dispatcher,
        row_attributes: ['type']
        // fixed: true
      }), '#alerts-ongoing-list');

      this.setView(new TableView({ 
        parent: this,
        collection: this.collections.transient, 
        template: TableTpl,
        row_template: RowTpl,
        helpers: this.helpers,
        context: { url: this.url },
        dispatcher: Dispatcher,
        row_attributes: ['type']
        // fixed: true
      }), '#alerts-transient-list');
    }
  });
  
  return View;
});

