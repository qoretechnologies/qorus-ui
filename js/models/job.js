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
    allowed_actions: ['run', 'reset', 'set-expire', 'schedule', 'expiry_date'],


    initialize: function (options) {
      Model.__super__.initialize.call(this, options);
    },
    
    doAction: function(action, opts){
      debug.log('doing action', action);
      if(_.indexOf(this.allowed_actions, action) != -1){
        var id = this.id;
        var _this = this;
        debug.log(this.url());
        $.put(this.url(), {'action': action });     
      }
    }
  });
  // Return the model for the module
  return Model;
});