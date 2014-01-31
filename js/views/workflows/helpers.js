define(function (require) {
  var _               = require('underscore'),
      qorus_helpers   = require('qorus/helpers'),
      ControlsTpl     = require('tpl!templates/common/controls.html'),
      helpers;
  
  helpers = _.clone(qorus_helpers);
    
  return helpers;
});
