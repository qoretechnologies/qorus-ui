define([
  'jquery',
  'underscore',
  'qorus/qorus',
  // Pull in the Collection module from above
  'collections/jobs',
  'text!../../../templates/job/list.html',
  'qorus/dispatcher'
], function($, _, Qorus, Collection, Template, Dispatcher){
  var dispatcher = Dispatcher;
  var ListView = Qorus.ListView.extend({
    initialize: function(){
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
      dispatcher.on('JOB_INSTANCE_START', function (e) {
        console.log("JOB_INSTANCE_START", e);
      })
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return ListView;
});
