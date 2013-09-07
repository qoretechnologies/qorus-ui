define([
  'settings',
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  'models/result'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    model: Model,
    
    url: function () {
      return settings.REST_API_PREFIX + '/jobs/'+ this.jobid + '/results/?sort=job_instanceid;desc=true';
    },
    
    initialize: function (opts) {
      Collection.__super__.initialize.call(this, opts);
      this.opts.sort = 'started';
      
      if (_.has(opts, 'jobid')) {
        this.jobid = opts.jobid;
        delete opts.jobid;
      } else {
        this.url = settings.REST_API_PREFIX + '/jobs';
      }
    }    
  });

  return Collection;
});
