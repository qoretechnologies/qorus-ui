define(function (require) {
  var settings = require('settings'),
    _ = require('underscore'),
    Qorus = require('qorus/qorus'),
    Helpers = require('qorus/helpers'),
    obj_map, Model;
  
  obj_map = {
    workflow: {
      name: function (obj) {
        return sprintf('%(name)s v%(version)s, ID#%(id)s', obj);
      },
      url: function (obj) {
        return Helpers.getUrl('showWorkflow', { id: obj.id });
      }
    },
    service: {
      name: function (obj) {
        return sprintf('%(name)s v%(version)s, ID#%(id)s', obj);
      },
      url: function (obj) {
        return Helpers.getUrl('showService', { id: obj.id });
      }
    },
    job: {
      name: function (obj) {
        return sprintf('%(name)s v%(version)s, ID#%(id)s', obj);
      },
      url: function (obj) {
        return Helpers.getUrl('showJob', { id: obj.id });
      }
    },
    group: {
      name: function (obj) {
        return sprintf('%(name)s', obj);
      },
      url: function (obj) {
        return Helpers.getUrl('showGroup', { name: obj.name });
      }
    }
  }
  
  Model = Qorus.Model.extend({
    dateAttributes: ['when'],
    idAttribute: '_id',
    
    toJSON: function () {
      var obj = Model.__super__.toJSON.call(this),
        obj_type = obj_map[obj.type.toLowerCase()];
      
      console.log(obj);
      if (obj_type) {
        obj.object_url = obj_type.url(obj);        
        obj.object_name = obj_type.name(obj);
      } else {
        obj.object_name = obj.name;
      }
 
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