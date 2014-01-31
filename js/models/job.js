define(function (require) {
  var settings   = require('settings'),
      _          = require('underscore'),
      moment     = require('moment'),
      Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      utils      = require('utils'),
      Model;

  Model = Qorus.Model.extend({
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
    },
    
    getProperty: function (property) {
      var self = this,
          req;
      
      if (!this.get(property)) {
        $.get(_.result(this, 'url') + '/' + property)
          .done(function (data) {
            self.set(property, data);
          });
      } else {
        return this.get(property);
      }
    },
    
    parse: function () {
      response = Model.__super__.parse.apply(this, arguments);
      response.has_alerts = (response.alerts.length > 0);
      return response;
    }
  });

  return Model;
});
