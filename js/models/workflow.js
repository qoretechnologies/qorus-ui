define([
  'jquery',
  'messenger',
  'backbone',
  'qorus/qorus',
  'models/system',
  'sprintf',
  'jquery.rest'
], function($, messenger, Backbone, Qorus, System){
  var Model = Qorus.Model.extend({
    _name: 'workflow',
    urlRoot: "/rest/workflows/",
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
    allowedActions: ['start','stop','reset'],

    initialize: function (opts) {
      Model.__super__.initialize.call(this, opts);
      if (opts.id){
        this.id = opts.id;
      }
      
      // TODO: find proper place/way within the view
      this.on('sync', function(m, r){ 
        if (m.collection){
          m.collection.trigger('reset');
        }
      }, this);
    },
    
    doAction: function (action, opts) {
      if(_.indexOf(this.allowedActions, action) != -1){
        var wflid = this.id;
        var _this = this;
        $.put(this.url(), {'action': action, 'options': opts }, null, 'application/json')
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
      
      console.log(opts, sysopts);

      return _.extend(opts, sysopts);
    }
  });

  return Model;
});