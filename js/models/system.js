define([
  'settings',
  'underscore',
  'qorus/qorus'
], function(settings, _, Qorus){
  var System = {};

  var Info = Qorus.Model.extend({
    url: settings.REST_API_PREFIX + '/system',
    dateAttributes: ['alert-summary.cutoff'],

    initialize: function (options) {
      this.fetch();
    }
  });

  var User = Qorus.Model.extend({
    url: settings.REST_API_PREFIX + '/users/_current_',

    initialize: function (options) {
      this.fetch();
    }
  });

  var Options = Qorus.Model.extend({
    url: settings.REST_API_PREFIX + '/system/options',
    
    initialize: function (options) {  
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