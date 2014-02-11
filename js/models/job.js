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
    
    doAction: function(action, opts){
      debug.log('doing action', action);
      if(_.indexOf(this.allowed_actions, action) != -1){
        var params = opts || {};
        _.extend(opts, {'action': action });
        debug.log(this.url());
        $.put(this.url(), params);
      }
    },
    
    parse: function () {
      response = Model.__super__.parse.apply(this, arguments);
      response.has_alerts = (response.alerts.length > 0);
      return response;
    },
    
    fetch: function (options) {
      options = options || {};
      
      if (!options.data) options.data = {};
      _.extend(options.data, { lib_source: true });
      
      Model.__super__.fetch.call(this, options);
    }
  });

  return Model;
});
