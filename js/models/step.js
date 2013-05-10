define([
  'underscore',
  'qorus/qorus'
], function(_, Qorus){
  var Model = Qorus.Model.extend({
    idAttribute: "stepid",
    urlRoot: '/rest/steps/',
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
        })
      }
      return response;
    }
  });
  // Return the model for the module
  return Model;
});