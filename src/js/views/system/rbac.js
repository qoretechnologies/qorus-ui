define(function (require) {
  var Qorus     = require('qorus/qorus'),
      UsersView = require('views/system/rbac/users'),
      RolesView = require('views/system/rbac/roles'),
      Template  = require('tpl!templates/common/tabview.html'),
      View;
  
  View = Qorus.TabView.extend({
    url: '/rbac',
    tabs: {
      'users': UsersView,
      'roles': RolesView
    },
    template: Template
  });
  
  return View;
});
