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
    dateAttributes: ['last_executed'],
    allowed_actions: ['run', 'reset', 'set-expire', 'schedule'],


    initialize: function (options) {
      Model.__super__.initialize.call(this, options);

      var _this = this;
      // sync on event change
      this.listenTo(Dispatcher, 'job:' + this.id, function () {
        _this.fetch();
      });
      
      this.on('sync', function () {
        console.log(this.id, _this.collection);
      })
    },

    parse: function(response, options){
      // get date from cronÒ
      var next = [response.minute, response.hour, response.day, response.month, response.wday];
      response.next = utils.formatDate(utils.getNextDate(next.join(' ')));
      return Model.__super__.parse.call(this, response, options);
    },
    
    doAction: function(action, opts){
      if(_.indexOf(this.allowedActions, action) != -1){
        var id = this.id;
        var _this = this;
        
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