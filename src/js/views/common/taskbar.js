define(function(require) {
  var _     = require('underscore'),
      Qorus = require('qorus/qorus'),
      TaskBar;
  
  TaskBar = Qorus.View.extend({
    addIcon: function (view) {
      return this.insertView(view, 'self');
    }
  });
  
  return new TaskBar;
});
