define(function(require) {
  require('sprintf');
  
  var settings = require('settings'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: "stepid",
    urlRoot: settings.REST_API_PREFIX + '/steps/',
    dateAttributes: ['last_executed'],
    defaults: {
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

      if (response.functions){
        _.each(response.functions, function (func) {
          func.body = $.trim(func.body);
          // response.body = response.body.replace(/\\n/g, '<br>');
          func.body = func.body.replace(/\\n/g, '\n');
          func.body = func.body.replace(/\\t/g, '    ');
        });
      }
      
      return response;
    },
    
    getFullname: function () {
      var name = sprintf("%s v%s", this.get('name'), this.get('version'));
      
      if (this.get('patch')) {
        name += "." + this.get('patch');
      }
      
      return name;
    }
    
  });

  return Model;
});
