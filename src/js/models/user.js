define(function (require) {
  var _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      __       = require('_lodash'),
      Model;

  Model = Qorus.Model.extend({
    idAttribute: "username",
    urlRoot: settings.REST_API_PREFIX + '/users/',
    hasPermissions: function (perm) {
      if (typeof perm === 'string' && this.get('permissions'))
        return this.get('permissions').indexOf(perm) > -1;

      if(_.isArray(perm) && this.get('permissions'))
        return _.intersection(this.get('permissions'), perm).length > 0;

      return false;
    },
    getControls: function () {
      var controls = [];

      controls.push({ action: 'edit', icon: 'edit', title: 'Edit', css: 'warning' });
      controls.push({ action: 'delete', icon: 'remove', title: 'Remove', css: 'danger' });

      return controls;
    },
    doAction: function (opts) {
      if (opts.action === "delete") this.destroy();
      return this;
    },
    isNew: function () {
      if (this.is_new)
        return true;

      return Model.__super__.isNew.apply(this, arguments);
    },
    getPreferences: function (prop) {
      return __.get(this.get('storage'), prop);
    },
    setPreferences: function (prop, value) {
      __.set(this.get('storage'), prop, value);
      this.save({ storage: this.get('storage')});
    }
  });

  return Model;
});
