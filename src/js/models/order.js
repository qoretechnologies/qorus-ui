define(function (require) {
  var settings      = require('settings'),
      helpers       = require('qorus/helpers'),
      _             = require('underscore'),
      moment        = require('moment'),
      $             = require('jquery'),
      Qorus         = require('qorus/qorus'),
      Dispatcher    = require('qorus/dispatcher'),
      Tree          = require('qorus/tree'),
      Notifications = require('collections/notifications'),
      Model;

  require('sprintf');

  var STATUS_PRIORITY = [
    'COMPLETE',
    'ERROR',
    'RETRY',
    'EVENT-WAITING',
    'WAITING',
    'ASYNC-WAITING',
    'IN-PROGRESS'
  ];

  Model = Qorus.Model.extend({
    __name__: "OrderModel",
    urlRoot: settings.REST_API_PREFIX + '/orders/',
    idAttribute: "workflow_instanceid",

    defaults: {
      'note_count': 0,
      'started': moment().format(settings.DATE_DISPLAY)
    },

    /** list of allowed actions */
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
      "order:%(id)s:info_changed",
      "order:%(id)s:status_changed"
    ],

    /**
      Initialize Model
      @constructs
      @param {Object} [opts]
    */
    initialize: function (opts){
      // set id if in opts
      if (opts.id){
        this.id = opts.id;
        delete opts.id;
      }

      Model.__super__.initialize.call(this, opts);

      this.listenTo(Dispatcher, this.api_events, this.dispatch);
    },

    /**
      Dispatching events for model
      @param {Object} e
      @param {String} evt
    */
    dispatch: function (e, evt) {
      var evt_types = evt.split(':'),
          obj       = evt_types[0],
          id        = evt_types[1],
          action    = evt_types[2] || id;

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
        } else if (action === 'status_changed') {
          this.set({ workflowstatus: e.info.info.new });
          this.getProperty('actions', null, true);
          this.trigger('workflowstatus:change');
        }
        this.trigger('change', this);
      }
    },

    /**
      Parses the API response
      @param {Object} response
      #param {Object} [options]
    */
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
        var group = step_groups[name] = step_groups[name] || { steps: [], name: name, status: null };

        group.steps.push(step);

        var max = Math.max(_.indexOf(STATUS_PRIORITY, group.status), _.indexOf(STATUS_PRIORITY, step.stepstatus));

        group.status = STATUS_PRIORITY[max];

      });
      response.StepInstances = _.sortBy(response.StepInstances, 'started');
      response.step_groups = step_groups;
      response.actions = _.map(response.actions, function (action) { return action.toLowerCase(); });

      // create Hierarchy Tree from Hierarchy Info
      response.hierarchy_tree = Tree.createTree(response.HierarchyInfo, 'parent_workflow_instanceid');

      response = Model.__super__.parse.call(this, response, options);

      return response;
    },

    /**
      Executes the action on model and calls REST api
      @param {String} action
      @param {Object} [options]
      @param {function} [callback]
    */
    doAction: function(action, opts, callback){
      opts        = opts || {};
      opts.action = action;

      var url = helpers.getUrl('showWorkflow', { id: this.id }),
          self = this;


      if(_.indexOf(this.allowedActions, action.toLowerCase()) != -1){
        $.put(this.url(), opts)
          .done(function (resp) {
            var msg = sprintf('Order %s %s done', self.get('name'), action);
            Notifications.create({ group: 'orders', type: 'success', title: msg, url: url });
            if (_.isFunction(callback)) {
              callback(false);
            }
          })
          .fail(function (resp) {
            var msg = sprintf('Order %s %s failed', self.get('name'), action);
            Notifications.create({ group: 'orders', type: 'error', title: msg, url: url });
            if (_.isFunction(callback)) {
              callback(false);
            }
          });
      }
    },

    /**
      Gets Step name form StepInstances
      @param {Number|String} id Step ID
      @returns {String|Number} Stepname or step id
    */
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

    /**
      Add note to the order and calls REST API
      @param {String} note
    */
    addNote: function (note) {
      $.put(this.url(), {
        action: 'Notes',
        note: note
      });
    },

    update: function (note) {},

    /**
      Triggers remove event
    */
    destroy: function () {
      this.trigger('remove');
    }

  });
  return Model;
});
