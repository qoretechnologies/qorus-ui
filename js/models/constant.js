define([
  'settings',
  'underscore',
  'qorus/qorus'
], function(settings, _, Qorus){
  var Model = Qorus.Model.extend({
    idAttribute: "constantid",
    urlRoot: settings.REST_API_PREFIX + '/constant/',
    dateAttributes: ['created', 'modified'],
    
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
    }
  });
  // Return the model for the module
  return Model;
});