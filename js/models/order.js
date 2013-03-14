define([
  'jquery',
  'qorus/qorus'
], function($, Qorus){
  var Model = Qorus.Model.extend({
    urlRoot: '/rest/orders/',
    idAttribute: "executionID",
    allowedActions: ['uncancel','cancel', 'unblock', 'block', 'retry'],
    doAction: function(action, opts){
      if(_.indexOf(this.allowedActions, action) != -1){
        var wflid = this.id;
        $.put(this.url(), {'action': action })
        .done(
          function (e, ee, eee){
            var msg = sprintf('Order Instance %d %s done', wflid, action);
            $.globalMessenger().post(msg);
          }
        );        
      }
    }
  });
  return Model;
});