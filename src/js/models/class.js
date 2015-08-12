define(function (require) {
  var settings = require('settings'), 
      Qorus = require('qorus/qorus'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: "classid",
    urlRoot: settings.REST_API_PREFIX + '/classes/',
    dateAttributes: ['created', 'modified'],
    
    defaults: {
      type: 'class'
    },
    
    initialize: function (opts) {
      if (opts.id) {
        this.id = opts.id;
        delete opts.id;
      }
      
      Model.__super__.initialize.call(this, opts);
    },
  });

  return Model;
});