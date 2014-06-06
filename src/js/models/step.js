define(function(require) {
  var settings = require('settings'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: "stepid",
    urlRoot: settings.REST_API_PREFIX + '/steps/',
    dateAttributes: ['last_executed'],
    
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
    }
  });

  return Model;
});
