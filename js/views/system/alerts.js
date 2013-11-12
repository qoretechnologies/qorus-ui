define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'settings',
  'collections/alerts',
  'text!../../../templates/system/alerts/list.html',
  'text!../../../templates/system/alerts/table.html',
  'text!../../../templates/system/alerts/row.html'
], function($, _, Backbone, Qorus, settings, Collection, Template, TableTpl, RowTpl){
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
      this.setView(new Qorus.TableView({ 
          collection: this.collections.ongoing, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          context: { url: this.url },
          dispatcher: Dispatcher,
          // fixed: true
      }), '#alerts-ongoing-list');
    }
    
  });
  
  return View;
});

