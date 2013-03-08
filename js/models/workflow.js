define([
  'jquery',
  'messenger',
  'backbone',
  'qorus/qorus',
  'sprintf'
], function($, messenger, Backbone, Qorus){
  var Model = Qorus.Model.extend({
    initialize: function(opts){
      Model.__super__.initialize.call(this, opts);
      if (opts.id){
        this.id = opts.id;
      }
    },
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
      'CRASH': 0
    },
  	idAttribute: "workflowid",
    date: null,
    doAction: function(action, opts){
      var wflid = this.id;
      $.get(this.url(), { 'action': action}).done(
        function (e, ee, eee){
          var msg = sprintf('Workflow %d %s done', wflid, action);
          $.globalMessenger().post(msg);
        }
      );      
    }
  });
  // Return the model for the module
  return Model;
});