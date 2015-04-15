define(function (require) {
  require('sprintf');
  
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
      ORDER_STATES  = require('constants/workflow').ORDER_STATES,
      StepBase, Step, Model, prepareSteps;
  
  require('sprintf');

  StepBase = {
      initialize: function (id, depends_on, name, type, info) {
          this.name = name;
          this.id = id;
          this.depends_on = depends_on || [];
          this.children = [];
          this.subworkflow = true;
          this.root = false;
          this.parent_id = null;
          this.parent = null;
          this.level = 0;
          this.type = type || "process";
          this.info = info;
          this.fullname = this.getFullname();
      },
    
      size: function () {
         return this.depends_on.length;  
      },
    
      hasChildren: function() {
          return this.children.length > 0;
      },
    
      addChild: function(child) {
          child.parent_id = this.id;
          child.level = Math.max(child.level, this.level + 1);
          child.addParent(this);
          this.children.push(child);
          this.children = _.sortBy(this.children, 'id');
      },
    
      addParent: function (parent) {
        if (!this.parent) {
          this.parent = [parent];
        } else {
          this.parent.push(parent);
        }
      },
    
      getDepth: function () {
        if (!this.parent) return 0;
        var level = 1,
            max = 0;
        
        _.each(this.parent, function (p) {
          max = Math.max(max, p.getDepth());
        });
        
        return level + max;
      },
    
      getAllChildren: function (children) {
        children = children || [];
    
        _.each(this.children, function (child) {
          children.push(child);
          child.getAllChildren(children);
        }, this);
        
        return _.uniq(children);
      },
    
      toArray: function () {
        var children = this.getAllChildren(),
            root     = _.pick(this, ['id', 'name', 'type', 'info', 'fullname']),
            steps    = {};

        root.links_to = this.depends_on;
        root.children = _.map(this.children, function (c) { return _.parseInt(c.id); });
        
        steps[0] = [root];
        
        _.each(children, 
          function (step) { 
            var l = step.getDepth(),
                s = _.pick(step, ['id', 'name', 'type', 'info', 'fullname']);
          
            s.links_to = step.depends_on;
            s.children = _.map(step.children, function (c) { return _.parseInt(c.id); });
          
            if (!steps[l]) { 
              steps[l] = [s]; 
            } else { 
              steps[l].push(s);
            } 
        });
        
        return _.toArray(steps);
      },
    
      getFullname: function () {
        if (!this.info) return this.name;
        
        var name = sprintf("%s v%s", this.name, this.info.version);

        if (this.info.patch) {
          name += "." + this.info.patch;
        }

        return name;
      }
  };
  
  Step = function () {
      this.initialize.apply(this, arguments);
  };

  _.extend(Step.prototype, StepBase);
  
  
  prepareSteps = function (name, steps, stepmap, stepinfo) {
    if (!steps) return;

    var step_list = [],
        keys      = _.keys(steps, []),
        stype     = '',
        root;

    // add root point
    root = new Step(0, [], name, "start");
    step_list.push(root);

    // add steps to step_list
    _.each(keys, function (k) {
        if (steps[k].length === 0) {
            steps[k] = [0];
        }
        
        var info = _.findWhere(stepinfo, { name: stepmap[k] });
        var sinfo;
        if (info) {
          stype = info.steptype.toLowerCase();
          sinfo = _.clone(info);
          if (info.ind === 0) sinfo.subwfls = _.where(stepinfo, { name: stepmap[k] });
        }
        
        var node = new Step(k, steps[k], stepmap[k], stype, sinfo);
        step_list.push(node);
    });

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
  };
  
  Model = Qorus.Model.extend({
    __name__: 'Workflow',
    _name: 'workflow',
    urlRoot: settings.REST_API_PREFIX + '/workflows/',
    // url: function () {
    //   return this.urlRoot + this.id;
    // },
    defaults: function () {
      var defaults = {};
      
      _.each(_.pluck(ORDER_STATES, 'name'), function (item ) {
        defaults[item] = 0;
      });
      
      return defaults; 
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
      'setOptions',
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
      
      this.on('change', this.updateTotal);
    },
    
    dispatch: function (e, evt) {
      if (parseInt(e.info.id, 10) !== this.id) return;
      
//      console.log(e, evt, this.collection);
      
      var evt_types = evt.split(':'),
          obj = evt_types[0],
          id = evt_types[1],
          action = evt_types[2] || id,
          alert = /^(alert_).*/;
      
      if (obj === 'workflow') {
        if (action === 'start') {
          this.set('autostart', e.info.autostart);
          this.incr('exec_count');
        } else if (action === 'stop') {
          this.set('autostart', e.info.autostart);
          this.decr('exec_count');
        } else if (action === 'data_submitted') {
          this.incr(e.info.status);
        } else if (action === 'status_changed') {
          this.decr(e.info.info.old);
          this.incr(e.info.info['new']);
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
      var self  = this, 
          url   = helpers.getUrl('showWorkflow', { id: this.id }),
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
        
        var req = $.put(this.url(), params, null, 'application/json')
          .done(
            function () {
              var msg = sprintf('Workflow %s %s done', self.get('name'), action);
              Notifications.create({ group: 'workflows', type: 'success', title: msg, url: url });
              if (_.isFunction(callback)) {
                callback(true);
              }
            }
          )
          .fail(
            function () {
              var msg = sprintf('Workflow %s %s failed', self.get('name'), action);
              Notifications.create({ group: 'workflows', type: 'error', title: msg, url: url });
              if (_.isFunction(callback)) {
                callback(false);
              }
          });
        
        /* 
          Autostart workaround for the stopped workflows, because there are not system event like 
          WORKFLOW_START WORKFLOW_STOP we have to do that manually 
         */
        if (this.get('exec_count') === 0 && _.contains(['setAutostart', 'decAutostart', 'incAutostart'], action)) {
          switch (action) {
            case 'setAutostart':
              this.set({ autostart: opts.autostart });
              break;
            case 'decAutostart':
              this.decr('autostart');
              break;
            case 'incAutostart':
              this.incr('autostart');
              break;
          }
        }
        
        return req;
      }
      return false;
    },
    
    fetch: function (options) {
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
      if (response.alerts) response.has_alerts = (response.alerts.length > 0);
      
      response.lib = _.extend({}, response.lib, { wffuncs: response.wffuncs, stepfuncs: this.mapStepInfo(response.stepinfo) });
      response.options = this.prepareOptions(response.options);
      return response;
    },
    
    // return all options for starting workflow
    getOptions: function () {
      return this.get('options');
    },
    
    prepareOptions: function (options) {
      var opts    = _.clone(options), 
          exclude = [],
          sysopts = System.Options.getFor('workflow');
      
//      _.each(sysopts, function (opt, idx) {
//        var syso = _.find(opts, { name: opt.name });
//        var val;
//          
//        if (syso) {
//          val = syso.value;
//          syso = _.extend(syso, opt, { sysvalue: opt.value, value: val });
//        } else {
//          opts.push(opt);
//        }
//      });
      
      _.each(opts, function (o) {
        var syso = _.find(syso, { name: o.name });
        
        if (syso) {
          var val = o.value;
          _.extend(o, syso, { val: val, sysvalue: syso.value });
        }
      });
      
      return opts;
    },
    
    setAutostart: function (as) {
      return this.doAction('setAutostart', { autostart: as });
    },
    
    setOption: function (option, value) {
      var req       = this.doAction('setOptions', { options: sprintf("%s=%s", option, value)}),
          options   = this.get('options'),
          opt       = _.find(options, { name: option });
      
      if (opt.system && !value) {
        opt.value = opt.sysvalue;
      } else {
        opt.value = value; 
      }
      
      this.set('options', options);
      
      return value;
    },
    
    prepareSteps: prepareSteps,
        
    mapSteps: function () {
      return this.prepareSteps(this.get('name'), this.get('steps'), this.get('stepmap'), this.get('stepinfo'));
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
          label: 'READY/SCHD',
          value: this.get('READY') + this.get('SCHEDULED'),
          color: '#aded9b'
        },
        {
          label: 'RUN/WAIT',
          value: this.get('WAITING') + this.get('IN-PROGRESS') + this.get('INCOMPLETE') + this.get('ASYNC-WAITING') + this.get('RETRY'),
          color: '#e5c737'
        },
        {
          label: 'ERR/BLOCK',
          value: this.get('ERROR') + this.get('BLOCKED'),
          color: '#b94a48'
        },
        {
          label: 'CANCELED',
          value: this.get('CANCELED'),
          color: '#f2dede'
        },
        {
          label: 'COMPLETED',
          value: this.get('COMPLETE'),
          color: '#9ccb3b'
        }
      ];
      
      // console.log('generating graph data', this.get('name'), this.date || this.collection.date);
      // var data = _.map(vals, function (v, idx) { return { name: idx, value: v.count, color: v.color }});
      
      return vals;
    },
    
    getControls: function () {
      var controls = [];
      
      if (this.get('enabled') === true) controls.push({ action: 'disable', icon: 'off', title: 'Disable', css: 'success' });
      if (this.get('enabled') === false) controls.push({ action: 'enable', icon: 'off', title: 'Enable', css: 'danger' });
      
      controls.push({ action: 'reset', icon: 'refresh', title: 'Reset', css: 'warning' });
      // controls.push({ action: 'options', icon: 'cog', title: 'Set options' });
      
      // if (item.deprecated === false) controls.push({ action: 'hide', icon: 'flag-alt', title: 'Hide'});
      // if (item.deprecated === true) controls.push({ action: 'show', icon: 'flag', title: 'Show'});
      return controls;
    },
    
    updateTotal: function () {
      var states = _.pluck(ORDER_STATES, 'name'),
          total  = 0;
          
      _.each(states, function (state) {
        total += this.attributes[state];
      }, this);
    
      this.attributes.TOTAL = total;
    },
    
    transformName: function (objects, format, attrs) {
      _.each(objects, function (obj) {
        obj.formatted_name = sprintf(format, _.pick(obj, attrs));
      });
      return objects;
    },
    
    mapStepInfo: function (stepinfo) {
      var steps = [];
			
      _.each(stepinfo, function (step) {
        _.each(step.functions, function (func) {
          func.header = step.name;
          func.formatted_name = sprintf("<small class='label label-info label-small' title='%s'>%s</small> %s", 
            func.type, func.type.slice(0,1).toUpperCase(), func.name);
          steps.push(func);
        });
      });
      return _.chain(steps).unique('name').sortBy('header').value();
    },
    
    getSources: function () {
      var self = this;
      
      // TODO: fix caching
//      if (!this._lib_source) {
        this.fetch({ data: { lib_source: true }, success: function () {
          self._lib_source = true;
        }});
//      }
    }
  });

  return Model;
});
