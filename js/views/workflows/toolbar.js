define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!/templates/toolbars/orders.html'
], function($, _, Qorus, Template){
  var Toolbar = Qorus.View.extend({
    context: {
      predefined_statuses: [
        'Ready', 'Scheduled', 'Complete', 'Incomplete', 'Error', 'Canceled', 
        'Retry', 'Waiting', 'Async-Waiting', 'Event-Waiting', 'In-Progress', 
        'Blocked', 'Crash'
      ]
    },
    initialize: function(opts){
  	  _.bindAll(this, 'render');
      _.extend(this.context, opts);

      this.template = Template;
    },
  });
  return Toolbar;
});
