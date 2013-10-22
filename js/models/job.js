define([
  'settings',
  'underscore',
  'moment',
  'qorus/qorus',
  'qorus/dispatcher',
  'utils',
  // 'later.recur',
  // 'later.cron'
], function(settings, _, moment, Qorus, Dispatcher, utils){

  var Model = Qorus.Model.extend({
    model_cls: 'job',
    idAttribute: "jobid",
    urlRoot: settings.REST_API_PREFIX + '/jobs/',
    dateAttributes: ['last_executed', 'next'],
    allowed_actions: ['run', 'reset', 'set-expire', 'schedule', 'expiry_date', 'setActive'],


    initialize: function (options) {
      Model.__super__.initialize.call(this, options);
    },
    
    doAction: function(action, opts){
      debug.log('doing action', action);
      if(_.indexOf(this.allowed_actions, action) != -1){
        var params = opts || {};
        _.extend(opts, {'action': action });
        debug.log(this.url());
        $.put(this.url(), params);
      }
    }
  });
  // Return the model for the module
  return Model;
});