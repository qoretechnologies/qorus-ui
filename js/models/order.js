define(function (require) {
  var settings   = require('settings'),
      $          = require('jquery'),
      Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Tree       = require('qorus/tree'),
      Model;
  
  Model = Qorus.Model.extend({
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
      //   // debug.log('Orders->Syncing', m.id, m.collection);
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
      var step_groups = {};
      // unescape info string
      _.each(response.ErrorInstances, function (err) {
        // is it safe?
        if (err.info) {
          err.info = err.info.replace(/\\n/g, "\n").replace(/\\"/g, "\""); 
        }
      });

      // group StepInstances
      _.each(response.StepInstances, function (step) {
        var name = step.stepname;
        var group = step_groups[name] = step_groups[name] || { steps: [], name: name, status: 'COMPLETE' };
        
        group.steps.push(step);
        
        if (step.stepstatus !== 'COMPLETE') {
          group.status = step.stepstatus;
        } 
        
      });
      response.step_groups = step_groups;
      
      // create Hierarchy Tree from Hierarchy Info
      response.hierarchy_tree = Tree.createTree(response.HierarchyInfo, 'parent_workflow_instanceid');
      
      response = Model.__super__.parse.call(this, response, options);
      
      return response
    },
    
    doAction: function(action, opts){
      var self = this, id = this.id, action = action.toLowerCase();
      
      if(_.indexOf(this.allowedActions, action) != -1){
        $.put(this.url(), {'action': action })
        .done(
          function (e, ee, eee){
            var msg = sprintf('Order Instance %s %s done', id, action);
            // $.globalMessenger().post(msg);
            self.fetch();
          }
        ).fail(
          function(e, ee, eee){
            var msg = sprintf('Order Instance %s %s failed', id, action);
            // $.globalMessenger().post({ message: msg, type: 'error' });
          }
        );        
      }
    }
  });
  return Model;
});
