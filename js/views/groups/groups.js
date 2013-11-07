define([
  'jquery',
  'underscore',
  'utils',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/groups',
  'text!../../../templates/groups/list.html',
  'text!../../../templates/groups/table.html',
  'text!../../../templates/groups/row.html'
], function($, _, utils, Qorus, Dispatcher, Collection, Template, TableTpl, RowTpl){

  var ListView = Qorus.ListView.extend({
    title: "Groups",
    model_name: 'group',
    template: Template,

    initialize: function (collection, options) {
      ListView.__super__.initialize.call(this, Collection, options);
      this.listenTo(Dispatcher, 'group:status_changed', this.updateModels);
    },
    
    preRender: function () {
      console.log('prerender')
      this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          // helpers: this.helpers,
          dispatcher: Dispatcher,
          fixed: true
      }), '#group-list');
    },
    
    updateModels: function(e) {
      var m = this.collection.findWhere({ name: e.info.name });
      m.set('enabled', e.info.enabled);
    }
  });

  return ListView;
});
