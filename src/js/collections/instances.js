define([
  'settings',
  'underscore',
  'qorus/qorus',
  'models/instance'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: function() {
      return settings.REST_API_PREFIX + '/workflows/'+ this.workflowid + '/instances/'
    },
    initialize: function (models, opts){
      this.opts = opts;
      this.workflowid = opts.workflowid;
      
      this.opts.url = null;
      
      Collection.__super__.initialize.apply(this, arguments);
    },
    model: Model,
  });
  return Collection;
});