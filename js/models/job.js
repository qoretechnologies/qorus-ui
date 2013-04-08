define([
  'underscore',
  'moment',
  'qorus/qorus',
  'utils'
], function(_, moment, Qorus, utils){
  var Model = Qorus.Model.extend({
    idAttribute: "jobid",
    urlRoot: '/rest/jobs/',
    initialize: function(){
        if (this.has('last_executed')) {
            this.last = utils.parseDate(this.get('last_executed'));
            this.set('last_executed', utils.formatDate(this.last));
        }
        // get next schedule time
        var next = [this.get('minute'), this.get('hour'), this.get('day'), this.get('month'), this.get('wday')]
        var next_value = utils.getNextDate(next.join(' '), this.last);
        this.set('next', utils.formatDate(next_value));
    }
  });
  // Return the model for the module
  return Model;
});