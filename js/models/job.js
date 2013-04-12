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
      var next, next_value;
      next = [response['minute'], response['hour'], response['day'], response['month'], response['wday']];
      
      next_value = later().getNext(cronParser().parse(next.join(' ')));
      response['next'] = moment(next_value).format(utils.settings.DATE_DISPLAY);
      return Model.__super__.parse.call(this, response, options);
    }
  });
  // Return the model for the module
  return Model;
});