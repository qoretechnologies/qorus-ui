define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: 'name',
    nameAttribute: 'name',
    urlRoot: settings.REST_API_PREFIX + '/perms/',
    defaults: {
      permission_type: 'USER'
    },
    getControls: function () {
      var controls = [];
      
      if (this.get('permission_type') != 'SYSTEM') {
        controls.push({ action: 'edit', icon: 'edit', title: 'Edit', css: 'warning' });
        controls.push({ action: 'delete', icon: 'remove', title: 'Remove', css: 'danger' });  
      }
      
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
    }
  });

  return Model;
});
