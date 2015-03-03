define(function (require) {
  require('sprintf');
  
  var settings = require('settings'), 
      Qorus    = require('qorus/qorus'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: "constantid",
    urlRoot: settings.REST_API_PREFIX + '/constants/',
    dateAttributes: ['created', 'modified'],
    
    defaults: {
      type: 'constant',
      patch: null
    },
    
    initialize: function (opts) {
      if (opts.id) {
        this.id = opts.id;
        delete opts.id;
      }
      
      Model.__super__.initialize.call(this, opts);
    },
    
    parse: function (response, options) {
      response = Model.__super__.parse.call(this, response, options);

      if (response.body){
        response.body = $.trim(response.body);
        response.body = response.body.replace(/\\n/g, '\n');
        response.body = response.body.replace(/\\t/g, '    ');
      }
      
      return response;
    },
      
    getFullname: function () {
      var name = sprintf("%s v%s", this.get('name'). this.get('version'));
      
      if (this.get('patch')) {
        name += "." + this.get('patch');
      }
      
      return name;
    }
    
  });
  // Return the model for the module
  return Model;
});
