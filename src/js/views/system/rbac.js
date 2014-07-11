define(function (require) {
  var Qorus     = require('qorus/qorus'),
      UsersView = require('views/system/rbac/users'),
      RolesView = require('views/system/rbac/roles'),
      Template  = require('tpl!templates/common/tabview.html'),
      View;
  
  View = Qorus.TabView.extend({
    upstreamUrl: '/system',
    url: '/rbac',
    tabs: {
      'users': UsersView,
      'roles': RolesView
    },
    template: Template,
    initialize: function () {
      View.__super__.initialize.apply(this, arguments);
    }
  });
  
  return View;
});
