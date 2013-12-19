define(function (require) {
  var settings      = require('settings'), 
      $             = require('jquery'), 
      Qorus         = require('qorus/qorus'),
      Notifications = require('collections/notifications'),
      Model;
  
  Model = Qorus.Model.extend({
    urlRoot: settings.REST_API_PREFIX + '/exec/',
    idAttribute: "executionID",
    allowedActions: ['stop'],
    dateAttributes: ['starttime'],
    doAction: function(action, opts){
      if(_.indexOf(this.allowedActions, action) != -1){
        var wflid = this.id;
        $.put(this.url(), {'action': action })
        .done(
          function (e, ee, eee){
            var msg = sprintf('Instance %d %s done', wflid, action);
            Notifications.create({ group: 'instances', type: 'info', title: msg });
          }
        );        
      }
    }
  });
  return Model;
});
