define(function (require) {
  var Backbone    = require('backbone'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Template    = require('tpl!templates/system/rbac/perms.html'),
      TableTpl    = require('text!templates/system/rbac/perms/table.html'),
      RowTpl      = require('text!templates/system/rbac/perms/row.html'),
      RoleTpl     = require('tpl!templates/system/rbac/perms/detail.html'),
      PaneView    = require('views/common/pane'),
      Permissions = require('collections/permissions'),
      BaseToolbar = require('views/toolbars/toolbar'),
      ToolbarTpl  = require('tpl!templates/system/rbac/perms/toolbar.html'),
      View, RowView, Toolbar;

  Toolbar = BaseToolbar.extend({
    fixed: false
  });
  
  RowView = Qorus.RowView.extend({
    additionalEvents: {
      "click [data-action]": 'doAction'
    },
    doAction: function (e) {
      var $target = $(e.currentTarget),
          opts    = $target.data();
      
      if (opts.action == 'edit') {
        this.trigger('edit', this.model);
        this.parent.trigger('row:edit', this.model);
      } else if (opts.action == 'clone') {
        this.trigger('clone', this.model);
        this.parent.trigger('row:clone', this.model);
      } else {
        this.model.doAction(opts);
      }
    }
  });
  
  // Roles listing view
  View = Qorus.ListView.extend({
    url: "/perms",
    collection: new Permissions(),
    template: Template,
    preRender: function () {
      var TView = this.setView(new Qorus.TableView({
        url: "/perms",
        collection: this.collection, 
        template: TableTpl, 
        row_template: RowTpl,
        row_view: RowView
      }), '#perms-list');
      
      this.setView(new Toolbar({ template: ToolbarTpl }), '.toolbar');
    }
  });
  
  return View;
});
