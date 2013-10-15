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

      // changed add to views to simpler management
      // listen to dispatcher
      // var _this = this;
      // this.listenTo(Dispatcher, "service:start service:stop service:error", function (e) {
      //   // fetch only if event.info.id equals this model
      //   if (e.info.id == _this.id) {
      //     debug.log('Updating/fetching', _this.id, _this);
      //     _this.fetch();
      //   }
      // });
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
        debug.log(this.url(), action);
        $.put(this.url(), {'action': action });     
      }
    }
  });
  return ServiceModel;
});