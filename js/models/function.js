define([
  'underscore',
  'qorus/qorus'
], function(_, Qorus){
  var Model = Qorus.Model.extend({
    idAttribute: "function_instanceid",
    urlRoot: '/rest/functions/',
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
        console.log('hello', response.body);
        response.body = $.trim(response.body);
        // response.body = response.body.replace(/\\n/g, '<br>');
        response.body = response.body.replace(/\\n/g, '\n');
        response.body = response.body.replace(/\\t/g, '    ');
        console.log('dolly', response.body);
      }
      return response;
    }
  });
  // Return the model for the module
  return Model;
});