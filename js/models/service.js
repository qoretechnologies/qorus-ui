define(function (require) {
  var _             = require('underscore'),
      $             = require('jquery'),
      settings      = require('settings'),
      Qorus         = require('qorus/qorus'),
      Notifications = require('collections/notifications'),
      Model;
  
  
  Model = Qorus.Model.extend({
    defaults: {
      threads: '-'
    },
    urlRoot: settings.REST_API_PREFIX + '/services/',
    idAttribute: "serviceid",
    allowedActions: ['load','unload','reset','setAutostart'],

    // get available actions
    actions: function () {
      var status = this.get('status'),
          actions = [];
          
      if (status == 'unloaded') {
        actions.push('load');
      } else {
        actions.push('unload');
        actions.push('reset');
      }
        
      return actions;
    },

    doAction: function(action, opts, callback){
      var options = { action: action },
          url     = null,
          resp;
      
      _(options).extend(opts);

      if(_.indexOf(this.allowedActions, action) != -1){
        $.put(this.url(), options)
          .fail(
            function (data) {
              resp = data.responseJSON;
              Notifications.create({ group: 'services', type: 'error', title: resp.err, description: resp.desc, url: url });
              if (_.isFunction(callback)) {
                callback();
              }
          });
      }
    },
    
    setOption: function (opts) {
      $.put(this.url(), opts, null, 'application/json');
    },
    
    toJSON: function () {
      var json = Model.__super__.toJSON.call(this, arguments);
      json.actions = this.actions();
      return json;
    }
  });
  return Model;
});
