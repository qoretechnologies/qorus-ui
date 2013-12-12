define(function (require) {
  var settings   = require('settings'),
      utils      = require('utils'),
      _          = require('underscore'),
      $          = require('jquery'),
      Qorus      = require('qorus/qorus'),
      System     = require('models/system'),
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
    allowedActions: ['start','stop','reset','show','hide','setAutostart'],

    initialize: function (opts) {
      _.bindAll(this);
      opts = opts || {};
      Model.__super__.initialize.call(this, opts);
      if (opts.id){
        this.id = opts.id;
      }
    },
    
    doAction: function (action, opts, callback) {
      var params, wflid;

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
              if (_.isFunction(callback)) {
                callback();
              }
            }
          );
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
      return response;
    },
    
    // return all options for starting workflow
    getOptions: function () {
      var opts = this.get('options') || {};
      var sysopts = System.Options.getFor('workflow');

      return _.extend(opts, sysopts);
    },
    
    setAutostart: function (as) {
      this.doAction('autostart', { autostart: as });
    },
        
    mapSteps: function () {
      if (!this.get('steps')) return;

      var steps     = this.get('steps'),
          stepmap   = this.get('stepmap'),
          step_list = [],
          keys      = _.keys(steps, []),
          root;

      // add root point
      root = new Step(0, [], this.get('name'), "start");
      step_list.push(root);

      // add steps to step_list
      _.each(keys, function (k) {
          if (steps[k].length === 0) {
              steps[k] = [0];
          }
          var node = new Step(k, steps[k], stepmap[k]);
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
    }
  });

  return Model;
});
