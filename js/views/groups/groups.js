define([
  'jquery',
  'underscore',
  'utils',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/groups',
  'views/toolbars/groups_toolbar',
  'text!../../../templates/groups/list.html',
  'text!../../../templates/groups/table.html',
  'text!../../../templates/groups/row.html'
], function($, _, utils, Qorus, Dispatcher, Collection, ToolbarView, Template, TableTpl, RowTpl
){

  var ListView = Qorus.ListView.extend({
    title: "Groups",
    model_name: 'group',
    template: Template,

    initialize: function (collection, options) {
      ListView.__super__.initialize.call(this, Collection, options);
      this.listenTo(Dispatcher, 'group:status_changed', this.updateModels);
    },
    
    preRender: function () {
      this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          // helpers: this.helpers,
          dispatcher: Dispatcher,
          fixed: true
      }), '#group-list');
      this.setView(new ToolbarView(), '#toolbar');
    },
    
    updateModels: function (e, ev) {
      var m = this.collection.findWhere({ name: e.info.name });
      
      if (ev == 'group:status_changed')
        m.set('enabled', e.info.enabled);
    },
        
    // overrides default runBathAction changing ids for names
    runBatchAction: function (action, method, params) {
      var method = method || 'get',
        ids = this.getCheckedIds(),
        groups;
      
      // change ids for names
      groups = this.collection.filter(function (m) { return _.indexOf(ids, m.id) !== -1; });
      groups = _.map(groups, function (g) { return g.get('name'); });
      
      // extend params to add dataset params
      params = _.extend(params, { action: action, groups: groups.join(',') });
      
      if (method == 'get') {
        $request = $.get(this.collection.url, params);
      } else if (method == 'put') {
        $request = $.put(this.collection.url, params);
      } else if (method == 'delete') {
        $request = $.put(this.collection.url, params);
      }
      
      $request
        .done(function (resp){
          debug.log(resp);
        });
    }
  });

  return ListView;
});
