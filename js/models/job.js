define([
  'settings',
  'underscore',
  'moment',
  'qorus/qorus',
  'qorus/dispatcher',
  'utils',
  'later.recur',
  'later.cron'
], function(settings, _, moment, Qorus, Dispatcher, utils){

  var Model = Qorus.Model.extend({
    model_cls: 'job',
    idAttribute: "jobid",
    urlRoot: settings.REST_API_PREFIX + '/jobs/',
    dateAttributes: ['last_executed', 'next'],
    allowed_actions: ['run', 'reset', 'set-expire', 'schedule'],


    initialize: function (options) {
      Model.__super__.initialize.call(this, options);
    },

    parse: function(response, options){
      // get date from cron
      if (!response.next) {
        var next = [response.minute, response.hour, response.day, response.month, response.wday];
        response.next = utils.formatDate(utils.getNextDate(next.join(' ')));        
      }
      return Model.__super__.parse.call(this, response, options);
    },
    
    doAction: function(action, opts){
      console.log('doing action', action);
      if(_.indexOf(this.allowed_actions, action) != -1){
        var id = this.id;
        var _this = this;
        console.log(this.url());
        $.put(this.url(), {'action': action })
        .done(
          function (e, ee, eee){
            var msg = sprintf('Job %d %s done', id, action);
            $.globalMessenger().post(msg);
          }
        ).fail(
          function(e, ee, eee){
            var msg = sprintf('Job %d %s failed', id, action);
            $.globalMessenger().post({ message: msg, type: 'error' });
          }
        );        
      }
    }
  });
  // Return the model for the module
  return Model;
});