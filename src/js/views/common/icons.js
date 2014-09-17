define(function (require) {
  var TaskBar          = require('views/common/taskbar'),
      HealthView       = require('views/system/health'),
      RemoteHealthView = require('views/system/health_remote');
  
  TaskBar.addIcon(new HealthView());
  TaskBar.addIcon(new RemoteHealthView());
});
