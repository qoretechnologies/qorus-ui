define(function (require) {
  require('sprintf');
  
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: "function_instanceid",
    urlRoot: settings.REST_API_PREFIX + '/functions/',
    dateAttributes: ['created', 'modified'],

    defaults: {
      type: 'function'
    },
    
    initialize: function (opts) {
      if (opts.id) {
        this.id = opts.id;
        delete opts.id;
      }
      
      Model.__super__.initialize.call(this, opts);
    },
    
    defaults: {
      patch: null
    },
    
    parse: function (response, options) {
      response = Model.__super__.parse.call(this, response, options);

      if (response.body){
        response.body = $.trim(response.body);
        // response.body = response.body.replace(/\\n/g, '<br>');
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

  return Model;
});
