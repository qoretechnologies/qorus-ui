define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: 'role',
    urlRoot: settings.REST_API_PREFIX + '/roles/',
    getControls: function () {
      var controls = [];
      
      controls.push({ action: 'edit', icon: 'edit', title: 'Edit', css: 'warning' });
      controls.push({ action: 'delete', icon: 'remove', title: 'Remove', css: 'danger' });
      // controls.push({ action: 'clone', icon: 'copy', title: 'Clone', css: 'success' });
      
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
