define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: "error",
    urlRoot: function () {
      var type = this.get('type');
      console.log(this.toJSON(), this.get('workflowid'));
      if (type === 'global') {
        return [settings.REST_API_PREFIX, 'errors', 'global'].join('/');
      } else if (type === 'workflow') {
        return [settings.REST_API_PREFIX, 'errors', 'workflow', this.get('workflowid')].join('/');
      }
      return [settings.REST_API_PREFIX, 'errors'].join('/');
    },

    getControls: function () {
      var controls  = [],
          type      = this.get('type');
      
      if (type === 'workflow') {
        controls.push({ action: 'edit', icon: 'edit', title: 'Edit', css: 'warning' });
        controls.push({ action: 'delete', icon: 'remove', title: 'Remove', css: 'danger' });
      } else if (type === 'global') {
        controls.push({ action: 'clone', icon: 'copy', title: 'Override', css: 'warning' });
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