define(function (require) {
  var FormView    = require('qorus/forms'),
      Permissions = require('collections/permissions'),
      Groups      = require('collections/groups'),
      Role        = require('models/role'),
      User        = require('models/user'),
      Roles       = require('collections/roles'),
      Fields      = require('qorus/fields'),
      Permission  = require('models/permission'),
      Forms       = {},
      GroupsMod;

  require('bootstrap.multiselect');

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
        collection: new Permissions()
      }),
      Fields.MultiSelectView.extend({
        name: 'Groups',
        attrName: 'groups',
        collection: new GroupsMod()
      })
    ],
    save: function () {
      if (this.model) {
        this.model.set(this.cleaned_data);

        if (!this.model.collection)
          this.model.is_new = true;

        this.listenToOnce(this.model, 'sync', this.onSave);
        this.listenToOnce(this.model, 'error', this.onError);
        this.model.save(null);
      }
    },
    onError: function (m, res) {
      if (res && res.responseJSON)
        this.showError(res.responseJSON.err + ': ' + res.responseJSON.desc);
      this.stopListening(this.model, 'sync');
    },
    onSave: function (model) {
      var opts = { merge: true };
      if (this.model.is_new) {
        delete this.model.is_new;
        opts = {};
      }

      this.collection.add(model, opts);

      this.trigger('close');
      this.stopListening(this.model, 'error');
      this.model = model;
    }
  });

  Forms.User = FormView.extend({
    model: User,
    className: 'form-horizontal',
    name: 'user-edit-form',
    fields: [
      Fields.InputView.extend({
        name: 'Username',
        attrName: 'username',
        required: true
      }),
      Fields.InputView.extend({
        name: 'Full name',
        attrName: 'name',
        required: true
      }),
      Fields.PasswordView.extend({
        name: 'Password',
        attrName: 'pass',
        required: true
      }),
      Fields.PasswordView.extend({
        name: 'Confirm Password',
        attrName: 'confirm-pass',
        required: true
      }),
      Fields.MultiSelectView.extend({
        name: 'Roles',
        attrName: 'roles',
        collection: new Roles()
      })
    ],
    save: function () {
      if (this.model) {
        this.model.set(this.cleaned_data);

        if (!this.model.collection)
          this.model.is_new = true;

        this.listenToOnce(this.model, 'sync', this.onSave);
        this.listenToOnce(this.model, 'error', this.onError);
        this.model.save(null);
      }
    },
    onError: function (m, res) {
      if (res && res.responseJSON)
        this.showError(res.responseJSON.err + ': ' + res.responseJSON.desc);
      this.stopListening(this.model, 'sync');
    },
    onSave: function (model) {
      var opts = { merge: true };
      if (this.model.is_new) {
        delete this.model.is_new;
        opts = {};
      }

      this.collection.add(model, opts);

      this.trigger('close');
      this.stopListening(this.model, 'error');
      this.model = model;
    }
  });

  Forms.UserEdit = Forms.User.extend({
    fields: [
      Fields.InputView.extend({
        name: 'Username',
        attrName: 'username',
        readonly: true
      }),
      Fields.InputView.extend({
        name: 'Full name',
        attrName: 'name',
        required: true
      }),
      Fields.MultiSelectView.extend({
        name: 'Roles',
        attrName: 'roles',
        collection: new Roles()
      })
    ]
  });

  Forms.Permission = FormView.extend({
    model: Role,
    className: 'form-horizontal',
    name: 'perm-edit-form',
    fields: [
      Fields.InputView.extend({
        name: 'Permission name',
        attrName: 'name',
        required: true,
        validator: /[^\s]/
      }),
      Fields.TextareaView.extend({
        name: 'Description',
        attrName: 'desc',
        required: true
      })
    ],
    save: function () {
      if (this.model) {
        this.model.set(this.cleaned_data);

        if (!this.model.collection)
          this.model.is_new = true;

        this.listenToOnce(this.model, 'sync', this.onSave);
        this.listenToOnce(this.model, 'error', this.onError);
        this.model.save(null);
      }
    },
    onError: function (m, res) {
      if (res && res.responseJSON)
        this.showError(res.responseJSON.err + ': ' + res.responseJSON.desc);
      this.stopListening(this.model, 'sync');
    },
    onSave: function (model) {
      var opts = { merge: true };
      if (this.model.is_new) {
        delete this.model.is_new;
        opts = {};
      }

      this.collection.add(model, opts);

      this.trigger('close');
      this.stopListening(this.model, 'error');
      this.model = model;
    }
  });

  return Forms;
});
