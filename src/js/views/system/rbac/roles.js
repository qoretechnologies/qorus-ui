define(function (require) {
  var Qorus    = require('qorus/qorus'),
      Roles    = require('collections/roles'),
      Template = require('tpl!templates/system/rbac/roles.html'),
      TableTpl = require('text!templates/system/rbac/roles/table.html'),
      RowTpl   = require('text!templates/system/rbac/roles/row.html'),
      View;
      
  View = Qorus.ListView.extend({
    collection: new Roles(),
    template: Template,
    preRender: function () {
      this.setView(new Qorus.TableView({ collection: this.collection, template: TableTpl, row_template: RowTpl }), '#role-list');
    }
  });
  
  return View;
});
