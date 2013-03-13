define([
  'jquery',
  'qorus/qorus'
], function($, Qorus){
  var Model = Qorus.Model.extend({
    urlRoot: '/rest/exec/',
    idAttribute: "executionID",
    allowedActions: ['stop'],
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