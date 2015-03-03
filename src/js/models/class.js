define(function (require) {
  require('sprintf');
  var settings = require('settings'), 
      Qorus = require('qorus/qorus'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: "classid",
    urlRoot: settings.REST_API_PREFIX + '/classes/',
    dateAttributes: ['created', 'modified'],
    
    defaults: {
      type: 'class',
      patch: null
    },
    
    initialize: function (opts) {
      if (opts.id) {
        this.id = opts.id;
        delete opts.id;
      }
      
      Model.__super__.initialize.call(this, opts);
    },
    
    getFullname: function () {
      var name = sprintf("%s v%s", this.get('name'). this.get('version'));
      
      if (this.get('patch')) {
        name += "." + this.get('patch');
      }
      
      return name;
    }
  });

  return Model;
});