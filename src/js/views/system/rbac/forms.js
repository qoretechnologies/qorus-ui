define(function (require) {
  var FormView    = require('qorus/forms'),
      Users       = require('collections/users'),
      Permissions = require('collections/permissions'),
      Role        = require('models/role'),
      Fields      = require('qorus/fields'),
      Forms       = {};
  
  Forms.Role = FormView.extend({
    model: Role,
    className: 'form-horizontal',
    name: 'role-edit-form',
    required: ['role', 'desc'],
    fields: [
      Fields.InputView.extend({
        name: 'Role name',
        attrName: 'role'
      }),
      Fields.TextareaView.extend({
        name: 'Description',
        attrName: 'desc'
      }),
      Fields.MultiSelectView.extend({
        name: 'Permissions',
        attrName: 'permissions',
        collection: new Permissions().fetch()
      }),
      Fields.MultiSelectView.extend({
        name: 'Users',
        attrName: 'users',
        collection: new Users().fetch()
      })
    ]
  });
  

  return Forms;
});
