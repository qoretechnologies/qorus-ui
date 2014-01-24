define(function (require) {
  var _             = require('underscore'),
      qorus_helpers = require('qorus/helpers'),
      ControlsTpl   = require('tpl!templates/common/controls.html'),
      helpers;
  
  helpers = _.clone(qorus_helpers);
  
  _(helpers).extend({
    createControls: function (item) {
      var controls = [];
      
      if (item.enabled === true) controls.push({ action: 'disable', icon: 'off', title: 'Disable', css: 'success' });
      if (item.enabled === false) controls.push({ action: 'enable', icon: 'off', title: 'Enable', css: 'danger' });
      
      controls.push({ action: 'reset', icon: 'refresh', title: 'Reset', css: 'warning' });
      controls.push({ action: 'options', icon: 'cog', title: 'Set options' });
      
      return ControlsTpl({ controls: controls });
    }
  });
  
  
  
  return helpers;
});
