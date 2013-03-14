define([
  'jquery',
  'qorus/qorus'
], function($, Qorus){
  var Model = Qorus.Model.extend({
    urlRoot: '/rest/orders/',
    idAttribute: "workflow_instanceid",
    allowedActions: ['uncancel','cancel', 'unblock', 'block', 'retry'],
    dateAttributes: ['started', 'completed', 'modified'],
    doAction: function(action, opts){
      if(_.indexOf(this.allowedActions, action) != -1){
        var id = this.id;
        $.put(this.url(), {'action': action })
        .done(
          function (e, ee, eee){
            var msg = sprintf('Order Instance %d %s done', id, action);
            $.globalMessenger().post(msg);
          }
        );        
      }
    }
  });
  return Model;
});