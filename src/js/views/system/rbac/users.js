define(function (require) {
  var Qorus    = require('qorus/qorus'),
      _        = require('underscore'),
      Users    = require('collections/users'),
      Template = require('tpl!templates/system/rbac/users.html'),
      TableTpl = require('text!templates/system/rbac/users/table.html'),
      RowTpl   = require('text!templates/system/rbac/users/row.html'),
      View, Col;

      
  View = Qorus.ListView.extend({
    collection: new Users(),
    template: Template,
    preRender: function () {
      this.setView(new Qorus.TableView({ 
        collection: this.collection, 
        template: TableTpl, 
        row_template: RowTpl 
    }), '#user-list');
    }
  });
  
  return View;
});
