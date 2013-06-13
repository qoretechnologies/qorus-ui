define([
  'settings',
  'jquery',
  'qorus/qorus',
  'qorus/dispatcher'
], function(settings, $, Qorus, Dispatcher){
  
  var Model = Qorus.Model.extend({
    urlRoot: settings.REST_API_PREFIX + '/orders/',
    idAttribute: "workflow_instanceid",
    allowedActions: ['uncancel','cancel', 'unblock', 'block', 'retry'],
    dateAttributes: ['started', 'completed', 'modified', 
      'HierarchyInfo.completed', 
      'HierarchyInfo.modified',
      'HierarchyInfo.started',
      'ErrorInstances.created',
      'StepInstances.started',
      'StepInstances.completed',
      'OrderInfo.created',
      'OrderInfo.modified',
      'InstanceInfo.created',
      'InstanceInfo.modified',
      'InstanceInfo.started',
      'InstanceInfo.completed',
      'AuditEvents.created'
    ],

    initialize: function(opts){      
      // set id if in opts
      if (opts.id){
        this.id = opts.id;
        delete opts.id;
      }
      
      Model.__super__.initialize.call(this, opts);

      // // TODO: find proper place/way within the view
      // this.on('sync', function(m, r){ 
      //   // console.log('Orders->Syncing', m.id, m.collection);
      //   if (m.collection){
      //     m.collection.trigger('reset');
      //   }
      // }, this);
      // 
    
      // update on dispatcher event
      var _this = this;
      this.listenTo(Dispatcher, 'workflow:status_changed', function (e) {
        if (e.info.instanceid == _this.id) {
          _this.fetch();
        }
      });
    },
    
    parse: function (response, options) {
      // unescape info string
      _.each(response.ErrorInstances, function (err) {
        // is it safe?
        if (err.info) {
          err.info = err.info.replace(/\\n/g, "\n").replace(/\\"/g, "\""); 
        }
      });
      
      response = Model.__super__.parse.call(this, response, options);
      return response
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