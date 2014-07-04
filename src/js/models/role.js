define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: 'role',
    urlRoot: settings.REST_API_URL + '/roles/',
    getControls: function () {
      var controls = [];
      
      controls.push({ action: 'clone', icon: 'copy', title: 'Clone', css: 'warning' });
      controls.push({ action: 'delete', icon: 'remove', title: 'Remove', css: 'danger' });
      
      return controls;
    },
    doAction: function (opts) {
      if (opts.action === "delete") this.destroy();
      return this;
    }
  });

  return Model;
});
