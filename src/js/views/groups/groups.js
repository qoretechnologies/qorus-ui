define(function (require) {
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Dispatcher  = require('qorus/dispatcher'),
      Collection  = require('collections/groups'),
      ToolbarView = require('views/toolbars/groups_toolbar'),
      Template    = require('text!templates/groups/list.html'),
      TableTpl    = require('text!templates/groups/table.html'),
      RowTpl      = require('text!templates/groups/row.html'),
      ListView, RowView;
  

  RowView = Qorus.RowView.extend({
    __name__: 'GroupRowView',
    template: RowTpl,

    additionalEvents: {
      'click [data-action]': 'doAction'
    },

    doAction: function (e) {
      var $target = $(e.currentTarget),
          action  = $target.data('action'),
          data    = $target.data();
  
      e.preventDefault();
      this.model.doAction(action, data);
    }
  });
  
  
  ListView = Qorus.ListView.extend({
    __name__: "GroupsListView",
    title: "Groups",
    model_name: 'group',
    template: Template,

    initialize: function (collection, options) {
      ListView.__super__.initialize.call(this, Collection, options);
      this.listenTo(Dispatcher, 'group:status_changed', this.updateModels);
    },
    
    preRender: function () {
      var TView;
      
      TView = this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_view: RowView,
          row_template: RowTpl,
          dispatcher: Dispatcher,
          fixed: true
      }), '#group-list');
      
      this.listenTo(TView, 'update', this.applySearch);
      
      this.setView(new ToolbarView(), '#toolbar');
    },
    
    updateModels: function (e, ev) {
      var m = this.collection.findWhere({ name: e.info.name });
      
      if (ev == 'group:status_changed')
        m.set('enabled', e.info.enabled);
    },
        
    // overrides default runBathAction changing ids for names
    runBatchAction: function (action, method, params) {
      method = method || 'get';
      var ids = this.getCheckedIds(),
        $request, groups;
      
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
