define([
  'settings',
  'jquery',
  'messenger',
  'backbone',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/system',
  'sprintf',
  'jquery.rest'
], function(settings, $, messenger, Backbone, Qorus, Dispatcher, System){
  var StepBase = {
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
          var children = [];
          var n;

          buffer = buffer || [];
          level = level || 0;
        
          _.each(this.children, function (c) {
              children.push(c.id);
              c.toArray(buffer, level+1);
          });
        
          n = { 
            id: this.id, 
            links_to: this.depends_on, 
            name: this.name,
            type: this.type
          };
        
          if (!buffer[level]) {
              buffer[level] = [n];
          } else {
              buffer[level].push(n);
          }
        
          return buffer;
      }
  };
  
  var Step = function (id) {
      this.initialize.apply(this, arguments);
  };

  _.extend(Step.prototype, StepBase);
  
  
  var Model = Qorus.Model.extend({
    _name: 'workflow',
    urlRoot: settings.REST_API_PREFIX + '/workflows/',
    defaults: {
      'name': "Workflow name",
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
      'IN-PROGRESS': 0,
      'BLOCKED': 0,
      'CRASH': 0,
      'TOTAL': 0
    },
    idAttribute: "workflowid",
    date: null,
    allowedActions: ['start','stop','reset', 'show', 'hide'],

    initialize: function (opts) {
      Model.__super__.initialize.call(this, opts);
      if (opts.id){
        this.id = opts.id;
      }
      
      // // TODO: find proper place/way within the view
      // this.on('sync', function(m, r){ 
      //   if (m.collection){
      //     m.collection.trigger('reset');
      //   }
      // }, this);
      
      // changed add to views to simpler management
      // listen to events
      // var _this = this;
      // this.listenTo(Dispatcher, 'workflow:start workflow:stop worfklow:data_submited', function (e) {
      //   if (e.info.id == _this.id) {
      //     _this.fetch();
      //   }
      // });
    },
    
    doAction: function (action, opts) {
      if(_.indexOf(this.allowedActions, action) != -1){
        var params;
        var wflid = this.id;
        var _this = this;
        
        if (action == 'hide') {
          params = { action: 'setDeprecated', deprecated: true }
        } else if (action == 'show')  {
          params = { action: 'setDeprecated', deprecated: false }
        } else {
          params = { action: action }
        }
        
        $.put(this.url(), params, null, 'application/json')
          .done(
            function (e, ee, eee){
              var msg = sprintf('Workflow %d %s done', wflid, action);
              $.globalMessenger().post(msg);
              _this.fetch();
            }
          );        
      }
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
      return response;
    },
    
    // return all options for starting workflow
    getOptions: function () {
      var opts = this.get('options') || {};
      var sysopts = System.Options.getFor('workflow');

      return _.extend(opts, sysopts);
    },
    
    mapSteps: function () {
      if (!this.get('steps')) {
        return;
      }

      var steps = this.get('steps');
      var stepmap = this.get('stepmap');
      var step_list = [];
      var keys = _.keys(steps, []);

      // add root point
      var root = new Step(0, [], this.get('name'), "start");
      step_list.push(root);

      // add steps to step_list
      _.each(keys, function (k) {
          if (steps[k].length == 0) {
              steps[k] = [0];
          }
          var node = new Step(k, steps[k], stepmap[k]);
          step_list.push(node);
      });


      // find parent steps
      _.each(step_list, function (step) {
          if (step.depends_on.length > 0) {
              var parent = _.find(step_list, function (n) { return n.id == step.depends_on[0]; });
        
              if (parent) {
                  parent.addChild(step);
              }
          }
      });
      return step_list[0].toArray();
    }
  });

  return Model;
});