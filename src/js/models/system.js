define(function (require) {
  var _              = require('underscore'),
      Qorus          = require('qorus/qorus'),
      settings       = require('settings'),
      SystemSettings = require('models/settings'),
      System         = {},
      Info, User, Options;

  System = {};

  Info = Qorus.Model.extend({
    url: settings.REST_API_PREFIX + '/system',
    dateAttributes: ['alert-summary.cutoff'],

    initialize: function () {
      this.on('sync', this.updateSettings);
      this.fetch();
    },
    
    updateSettings: function () {
      var session_id = this.get('session-id');
      var old_id = SystemSettings.get('session-id');

      if (session_id !== old_id) {
        SystemSettings.setSessionID(session_id);
        SystemSettings.save();
      }
    }
  });

  User = Qorus.Model.extend({
    url: settings.REST_API_PREFIX + '/users/?action=current',

    initialize: function () {
      this.fetch();
    },
    
    canBreakLock: function () {
      var perms = this.get('permissions');
      var allowed = ['WORKFLOW-CONTROL', 'WORKFLOW-ORDER-CONTROL', 'BREAK-WORKFLOW-ORDER-LOCK'];
      return _.intersection(perms, allowed).length > 0;
    }
  });

  Options = Qorus.Model.extend({
    url: settings.REST_API_PREFIX + '/system/options',
    
    initialize: function () {  
      this.fetch();
    },
    
    // returns object of system options as name as key and desc as value
    getFor: function (option) {
      var props = {};
      var options = {};
      props[option] = true;
      
      var opts = _.where(this.toJSON(), props);
      
      _.each(opts, function(opt) {
        options[opt.name] = opt.desc;
      });
      return options;
    }
  });

  return {
    Info: new Info(),
    User: new User(),
    Options: new Options()
  };
});
