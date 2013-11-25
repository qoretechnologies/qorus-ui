define([
  'settings',
  'underscore',
  'qorus/qorus',
  'qorus/helpers'
], function(settings, _, Qorus, Helpers){
  var obj_map = {
    workflow: 'showWorkflow',
    service: 'showService',
    job: 'showJob'
  }
  
  var Model = Qorus.Model.extend({
    dateAttributes: ['when'],
    idAttribute: '_id',
    
    toJSON: function () {
      var obj = Model.__super__.toJSON.call(this);
      
      obj.object_url = Helpers.getUrl(obj_map[obj.type.toLowerCase()], { id: obj.id });
      
      return obj;
    },
    
    parse: function (response) {
      response._id = response.type + response.id;
      return Model.__super__.parse.call(this, response);
    }
  });
  // Return the model for the module
  return Model;
});