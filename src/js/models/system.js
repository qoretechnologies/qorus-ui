define(function (require) {
  var _              = require('underscore'),
      Qorus          = require('qorus/qorus'),
      settings       = require('settings'),
      SystemSettings = require('models/settings'),
      OptionModel    = require('models/option'),
      Helpers        = require('qorus/helpers'),
      UserModel      = require('models/user'),
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

  User = UserModel.extend({
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

  Options = Qorus.Collection.extend({
    url: settings.REST_API_PREFIX + '/system/options',
    idAttribute: 'name',
    model: OptionModel,
    
    initialize: function () {  
      this.fetch();
    },
    
    // returns object of system options as name as key and desc as value
    getFor: function (option) {
      var props = {};
      var options = [];
      props[option] = true;
      
      var opts = _.where(this.toJSON(), props);
      
      _.each(opts, function(opt) {
        options.push(_.pick(opt, 'name', 'desc', 'default'));
      });
      return options;
    }
  });
  
  // monkey patch helpers add logged user
  Helpers.user = new User();
  Helpers.system_info = new Info();

  return {
    Info: Helpers.system_info,
    User: Helpers.user,
    Options: new Options()
  };
});
