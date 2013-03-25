define([
  'jquery',
  'qorus/qorus'
], function($, Qorus){
  var Model = Qorus.Model.extend({
    urlRoot: '/rest/orders/',
    idAttribute: "workflow_instanceid",
    allowedActions: ['uncancel','cancel', 'unblock', 'block', 'retry'],
    dateAttributes: ['started', 'completed', 'modified'],
    initialize: function(opts){
      Model.__super__.initialize.call(this, opts);
      // TODO: find proper place/way within the view
      this.on('sync', function(m, r){ 
        console.log('Orders->Syncing', m.id, m.collection);
        if (m.collection){
          m.collection.trigger('reset');
        }
      }, this);
    },
    doAction: function(action, opts){
      if(_.indexOf(this.allowedActions, action) != -1){
        var id = this.id;
        var _this = this;
        $.put(this.url(), {'action': action })
        .done(
          function (e, ee, eee){
            var msg = sprintf('Order Instance %d %s done', id, action);
            $.globalMessenger().post(msg);
            _this.fetch();
          }
        ).fail(
          function(e, ee, eee){
            var msg = sprintf('Order Instance %d %s failed', id, action);
            $.globalMessenger().post({ message: msg, type: 'error' });
          }
        );        
      }
    }
  });
  return Model;
});