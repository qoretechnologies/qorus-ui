define(function (require) {
  var FormView    = require('qorus/forms'),
      Users       = require('collections/users'),
      Permissions = require('collections/permissions'),
      Groups      = require('collections/groups'),
      Role        = require('models/role'),
      Fields      = require('qorus/fields'),
      Forms       = {},
      GroupsMod;
      
      
  GroupsMod = Groups.extend({
    initialize: function () {
      this.opts = {};
      this.opts.no_synthetic = true;
      this.sort_key = 'name';
     } 
  });
  
  Forms.Role = FormView.extend({
    model: Role,
    className: 'form-horizontal',
    name: 'role-edit-form',
    required: ['role', 'desc'],
    fields: [
      Fields.InputView.extend({
        name: 'Role name',
        attrName: 'role',
        required: true,
        validator: /[^\s]/
      }),
      Fields.TextareaView.extend({
        name: 'Description',
        attrName: 'desc',
        required: true
      }),
      Fields.MultiSelectView.extend({
        name: 'Permissions',
        attrName: 'permissions',
        collection: new Permissions().fetch()
      }),
      Fields.MultiSelectView.extend({
        name: 'Groups',
        attrName: 'groups',
        collection: new GroupsMod().fetch()
      })
    ],
    save: function () {
      if (this.model) {
        this.model.set(this.cleaned_data);
        
        if (!this.model.collection)
          this.model.is_new = true;

        this.listenToOnce(this.model, 'sync', this.onSave);
        this.listenToOnce(this.model, 'error', this.onError)
        this.model.save(null);
      }
    },
    onError: function () {
      this.stopListening(this.model, 'sync');
    },
    onSave: function (model) {
      console.log(model);
      if (this.model.is_new) {
        delete this.model.is_new;
        this.collection.add(model);
      }
      
      this.trigger('close');
      this.stopListening(this.model, 'error');
      this.model = model;
    },
  });

  return Forms;
});
