define([
  'settings',
  'jquery',
  'qorus/qorus'
], function(settings, $, Qorus){
  var Model = Qorus.Model.extend({
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
            $.globalMessenger().post(msg);
          }
        );        
      }
    }
  });
  return Model;
});