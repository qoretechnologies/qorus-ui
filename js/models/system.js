define([
  'underscore',
  'qorus/qorus'
], function(_, Qorus){
  var System = {};

  var Info = Qorus.Model.extend({
    url: '/rest/system',

    initialize: function (options) {
      this.fetch();
    }
  });

  var User = Qorus.Model.extend({
    url: '/rest/users',

    initialize: function (options) {
      this.fetch();
    }
  });

  var Options = Qorus.Model.extend({
    url: '/rest/system/options',
    
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