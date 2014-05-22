define(function (require) {
  var settings   = require('settings'),
      _          = require('underscore'),
      moment     = require('moment'),
      $          = require('jquery'),
      Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Tree       = require('qorus/tree'),
      Model;
  
  Model = Qorus.Model.extend({
    __name__: "OrderModel",
    urlRoot: settings.REST_API_PREFIX + '/orders/',
    idAttribute: "workflow_instanceid",
    allowedActions: ['uncancel','cancel', 'unblock', 'block', 'retry', 'lock', 'unlock', 'breaklock', 'setpriority', 'reschedule', 'skipstep'],
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
      'AuditEvents.created',
      'notes.created',
      'notes.modified'
    ],
    
    api_events_list: [
      "order:%(id)s:data_locked",
      "order:%(id)s:data_unlocked",
      "order:%(id)s:info_changed"
    ],

    initialize: function(opts){      
      // set id if in opts
      if (opts.id){
        this.id = opts.id;
        delete opts.id;
      }
      
      Model.__super__.initialize.call(this, opts);
    
      this.api_events = sprintf(this.api_events_list.join(' '), { id: this.id });
      this.listenTo(Dispatcher, this.api_events, this.dispatch);
    },
    
    dispatch: function (e, evt) {
      var evt_types = evt.split(':'),
          obj = evt_types[0],
          id = evt_types[1],
          action = evt_types[2] || id;

      if (obj === 'order') {
        if (action === 'info_changed') {
          var notes = this.get('notes') || [];
          var note_count = this.get('note_count');
          var info = e.info.info;
          info.created = moment(info.created, settings.DATE_FORMAT).format(settings.DATE_DISPLAY); 
          info.modified = info.created;
          notes.unshift(info);
          this.set({ notes: notes, note_count: note_count+1 });
          this.trigger('update:notes', this);
        } else if (action === 'data_locked') {
          if (_.isObject(e.caller)) {
            this.set('operator_lock', e.caller.user);
          } else {
            this.set('operator_lock', 'N/A');
          }
        } else if (action === 'data_unlocked') {
          this.unset('operator_lock');
        }
        this.trigger('change', this);
      }
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
      
      return response;
    },
    
    doAction: function(action, opts){
      action      = action;
      opts        = opts || {};
      opts.action = action;

      if(_.indexOf(this.allowedActions, action.toLowerCase()) != -1){
        $.put(this.url(), opts);
        // .done(
        //   function (e, ee, eee){
        //     var msg = sprintf('Order Instance %s %s done', id, action);
        //     self.fetch();
        //   }
        // ).fail(
        //   function(e, ee, eee){
        //     var msg = sprintf('Order Instance %s %s failed', id, action);
        //   }
        // );        
      }
    },
    
    getStepName: function (id) {
      var steps = _.filter(this.get('StepInstances'), function (s) {
        if (s.stepid == id)
          return s;
      });
      
      if (steps.length > 0) {
        return steps[0].stepname; 
      } else {
        return id;
      } 
    },
    
    addNote: function (note) {
      $.put(this.url(), {
        action: 'Notes',
        note: note
      });
    }
  });
  return Model;
});
