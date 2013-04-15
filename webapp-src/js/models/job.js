define([
  'underscore',
  'moment',
  'qorus/qorus',
  'utils',
  'later.recur',
  'later.cron'
], function(_, moment, Qorus, utils){
  var Model = Qorus.Model.extend({
    idAttribute: "jobid",
    urlRoot: '/rest/jobs/',
    dateAttributes: ['last_executed'],
    parse: function(response, options){
      // get date from cronÒ
      var next = [response.minute, response.hour, response.day, response.month, response.wday];
      response.next = utils.formatDate(utils.getNextDate(next.join(' ')));
      return Model.__super__.parse.call(this, response, options);
    }
  });
  // Return the model for the module
  return Model;
});