define(function (require) {
  var settings      = require('settings'),
      helpers       = require('qorus/helpers'),
      utils         = require('utils'),
      _             = require('underscore'),
      $             = require('jquery'),
      Qorus         = require('qorus/qorus'),
      System        = require('models/system'),
      Notifications = require('collections/notifications'),
      moment        = require('moment'),
      Dispatcher    = require('qorus/dispatcher'),      
      StepBase, Step, Model;
  
  StepBase = {
      initialize: function (id, depends_on, name, type) {
          this.name = name;
          this.id = id;
          this.depends_on = depends_on || [];
          this.children = [];
          this.subworkflow = true;
          this.root = false;
          this.parent_id = null;
          this.type = type || "process";
      },
    
      size: function () {
         return this.depends_on.length;  
      },
    
      hasChildren: function() {
          return this.children.length > 0;
      },
    
      addChild: function(child) {
          child.parent_id = this.id;
          this.children.push(child);
          this.children = _.sortBy(this.children, 'id');
      },
    
      toArray: function (buffer, level) {
          var children = [],
              children_sorted = _.sortBy(this.children, function (c) { return c.children.length; }),
              first_child = children_sorted[0];
          
          // debug.log(this.children,children_sorted);

          buffer = buffer || [];
          level = level || 1;
        
          if (first_child) {
            first_child.toArray(buffer, level+1);
          }
        
          _.each(this.children, function (c) {
              children.push({
                id: c.id, 
                links_to: c.depends_on,
                name: c.name,
                type: c.type
              });
          });

          if (!this.parent_id) {
              buffer[0] = [{ 
                id: this.id, 
                links_to: this.depends_on,
                name: this.name,
                type: this.type
              }];
          }

          buffer[level] = children;
        
          return buffer;
      }
  };
  
  Step = function () {
      this.initialize.apply(this, arguments);
  };

  _.extend(Step.prototype, StepBase);
  
  
  Model = Qorus.Model.extend({
    __name__: 'Workflow',
    _name: 'workflow',
    urlRoot: settings.REST_API_PREFIX + '/workflows/',
    defaults: {
      'IN-PROGRESS': 0,
      'READY': 0,
      'SCHEDULED': 0,
      'COMPLETE': 0,
      'INCOMPLETE': 0,
      'ERROR': 0,
      'CANCELED': 0,
      'RETRY': 0,
      'WAITING': 0,
      'ASYNC-WAITING': 0,
      'EVENT-WAITING': 0,
      'BLOCKED': 0,
      'CRASH': 0,
      'TOTAL': 0
    },
    idAttribute: "workflowid",
    date: null,
    allowedActions: [
      'start',
      'stop',
      'reset',
      'setAutostart',
      'incAutostart',
      'decAutostart',
      'enable',
      'disable'
    ],
    
    api_events_list: [
      "workflow:%(id)s:start ",
      "workflow:%(id)s:stop",
      "workflow:%(id)s:data_submitted",
      "workflow:%(id)s:status_changed",
      "group:%(id)s:status_changed",
      "workflow:%(id)s:alert_ongoing_raised",
      "workflow:%(id)s:alert_ongoing_cleared",
      "workflow:%(id)s:alert_transient_raised"
    ],

    initialize: function (opts) {
      opts = opts || {};
      Model.__super__.initialize.call(this, opts);
      if (opts.id){
        this.id = opts.id;
      }

      this.api_events = sprintf(this.api_events_list.join(' '), { id: this.id });
      this.listenTo(Dispatcher, this.api_events, this.dispatch);
    },
    
    dispatch: function (e, evt) {
      if (parseInt(e.info.id, 10) !== this.id) return;
      
      var evt_types = evt.split(':'),
          obj = evt_types[0],
          id = evt_types[1],
          action = evt_types[2] || id,
          alert = /^(alert_).*/;
      
      if (obj === 'workflow') {
        if (action === 'start') {
          this.incr('exec_count');
        } else if (action === 'stop') {
          this.decr('exec_count');
        } else if (action === 'workflow:data_submitted') {
          this.incr(e.info.status);
          this.incr('TOTAL');
        } else if (action === 'status_changed') {
          this.decr(e.info.info.old);
          this.incr(e.info.info.new);
        } else if (alert.test(action)) {
          this.getProperty('alerts', {}, true);
        }
      } else if (obj === 'group') {
        if (e.info.id === this.id && e.info.type === 'workflow') {
          this.set('enabled', e.info.enabled);
        }
      } 
      // debug.log(m.attributes);
      this.trigger('fetch');
    },
    
    doAction: function (action, opts, callback) {
      var self = this, 
          url = helpers.getUrl('showWorkflow', { id: this.id }),
          params, wflid;

      if (_.indexOf(this.allowedActions, action) != -1) {
        wflid = this.id;
        
        if (action == 'hide') {
          params = { action: 'setDeprecated', deprecated: true };
        } else if (action == 'show')  {
          params = { action: 'setDeprecated', deprecated: false };
        } else {
          params = { action: action };
        }
        
        if (opts) {
          _.extend(params, opts);
        }
        
        $.put(this.url(), params, null, 'application/json')
          .done(
            function () {
              var msg = sprintf('Workflow %s %s done', self.get('name'), action);
              Notifications.create({ group: 'workflows', type: 'success', title: msg, url: url });
              if (_.isFunction(callback)) {
                callback();
              }
            }
          )
          .fail(
            function () {
              var msg = sprintf('Workflow %s %s failed', self.get('name'), action);
              Notifications.create({ group: 'workflows', type: 'error', title: msg, url: url });
              if (_.isFunction(callback)) {
                callback();
              }
          });
      }
    },
    
    fetch: function (options) {
      debug.log('fetching workflow', this.get('name'));
      if (!options) options = {};
      if (!this.date && this.collection){
        this.date = this.collection.date;
        _.extend(options, { date: this.date });
      }
      Model.__super__.fetch.call(this, options);
    },
    
    parse: function (response, options) {
      // rewrite stepmap
      // response.stepmap = _.invert(response.stepmap);
      response = Model.__super__.parse.call(this, response, options);
      response.has_alerts = (response.alerts.length > 0);
      return response;
    },
    
    // return all options for starting workflow
    getOptions: function () {
      var opts = this.get('options') || {};
      var sysopts = System.Options.getFor('workflow');

      return _.extend(opts, sysopts);
    },
    
    setAutostart: function (as) {
      this.doAction('setAutostart', { autostart: as });
    },
        
    mapSteps: function () {
      if (!this.get('steps')) return;

      var steps     = this.get('steps'),
          stepmap   = this.get('stepmap'),
          stepinfo  = this.get('stepinfo'),
          step_list = [],
          keys      = _.keys(steps, []),
          stype     = undefined,
          root;

      // add root point
      root = new Step(0, [], this.get('name'), "start");
      step_list.push(root);

      // add steps to step_list
      _.each(keys, function (k) {
          if (steps[k].length === 0) {
              steps[k] = [0];
          }
          
          var info = _.findWhere(stepinfo, { name: stepmap[k]});
          if (info) stype = info.steptype.toLowerCase();
          var node = new Step(k, steps[k], stepmap[k], stype);
          step_list.push(node);
      }, this);

      _.each(step_list, function (step) {
          var parent;
    
          _.each(step.depends_on, function (dep) {
              parent = _.find(step_list, function (n) { return n.id == dep; });
        
              if (parent) {
                  parent.addChild(step);
              }
          });
      });
      
      return step_list[0].toArray();
    },
    
    // sets timerange for chart
    setStep: function (step) {
      step = step - 1;
      this.opts.date = utils.formatDate(moment().days(-step));
      this.fetch();
    },
    
    getDataset: function () {
      var vals = [
         {
          name: 'READY/SCHD',
          value: this.get('READY') + this.get('SCHEDULED'),
          color: '#aded9b'
        },
        {
          name: 'RUN/WAIT',
          value: this.get('WAITING') + this.get('IN-PROGRESS') + this.get('INCOMPLETE') + this.get('ASYNC-WAITING') + this.get('RETRY'),
          color: '#e5c737'
        },
        {
          name: 'ERR/BLOCK',
          value: this.get('ERROR') + this.get('BLOCKED'),
          color: '#b94a48'
        },
        {
          name: 'CANCELED',
          value: this.get('CANCELED'),
          color: '#f2dede'
        },
        {
          name: 'COMPLETED',
          value: this.get('COMPLETE'),
          color: '#9ccb3b'
        }
      ];
      
      // console.log('generating graph data', this.get('name'), this.date || this.collection.date);
      // var data = _.map(vals, function (v, idx) { return { name: idx, value: v.count, color: v.color }});
      
      return vals;
    },
    
    getControls: function () {
      var item     = this.toJSON(),
          controls = [];
      
      if (item.enabled === true) controls.push({ action: 'disable', icon: 'off', title: 'Disable', css: 'success' });
      if (item.enabled === false) controls.push({ action: 'enable', icon: 'off', title: 'Enable', css: 'danger' });
      
      controls.push({ action: 'reset', icon: 'refresh', title: 'Reset', css: 'warning' });
      // controls.push({ action: 'options', icon: 'cog', title: 'Set options' });
      
      // if (item.deprecated === false) controls.push({ action: 'hide', icon: 'flag-alt', title: 'Hide'});
      // if (item.deprecated === true) controls.push({ action: 'show', icon: 'flag', title: 'Show'});
      return controls;
    }
  });

  return Model;
});
