define(function (require) {
  var settings   = require('settings'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Model;
  
  Model = Qorus.Model.extend({
    urlRoot: settings.REST_API_PREFIX + '/groups/',
    allowed_actions: ['setStatus'],

    url: function () {
      return this.urlRoot + this.get('name');
    },
    
    doAction: function (action, opts) {
      if (_.indexOf(this.allowed_actions, action) != -1){
        var params = opts || {};
        _.extend(opts, {'action': action });
        $.put(this.url(), params);
      }
    },
    
    getControls: function () {
      var item     = this.toJSON(),
          controls = [];
      
      if (item.enabled === true) controls.push({ action: 'setStatus', icon: 'off', title: 'Disable', css: 'success', data: { enabled: false } });
      if (item.enabled === false) controls.push({ action: 'setStatus', icon: 'off', title: 'Enable', css: 'danger', data: { enabled: true } });
      
      return controls;
    }
  });

  return Model;
});
