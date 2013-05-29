define([
  'settings',
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'sprintf'
], function(settings, $, _, Qorus, Dispatcher){
  var ServiceModel = Qorus.Model.extend({
    defaults: {
      threads: '-',
    },
    urlRoot: settings.REST_API_PREFIX + '/services/',
    idAttribute: "serviceid",
    allowedActions: ['load','unload','reset'],
    
    initialize: function (opts) {
      ServiceModel.__super__.initialize.call(this, opts);
      
      var _this = this;
      this.listenTo(Dispatcher, 'service:' + this.id, function (e) {
        _this.fetch();
      });
    },

  	// get available actions
  	actions: function () {
  		var status = this.get('status');
  		var actions = []
  		if (status == 'unloaded') {
  			actions.push('load');
  		} else {
  			actions.push('unload');
  			actions.push('reset');
  		}

  		return actions;
  	},

    doAction: function(action, opts){
      if(_.indexOf(this.allowedActions, action) != -1){
        var id = this.id;
        var _this = this;
        console.log(this.url(), action);
        $.put(this.url(), {'action': action })
        .done(
          function (e, ee, eee){
            var msg = sprintf('Service %d %s done', id, action);
            $.globalMessenger().post(msg);
          }
        ).fail(
          function(e, ee, eee){
            var msg = sprintf('Service %d %s failed', id, action);
            $.globalMessenger().post({ message: msg, type: 'error' });
          }
        );        
      }
    }
  });
  return ServiceModel;
});