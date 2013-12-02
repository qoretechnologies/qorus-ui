define(function (require) {
  var settings = require('settings'),
    _          = require('underscore'),
    utils      = require('utils'),
    Qorus      = require('qorus/qorus'),
    Helpers    = require('qorus/helpers'),
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
    defaults: {
      name: 'N/A',
      version: 'N/A',
      id: 'N/A'
    },
    
    dateAttributes: ['when'],
    idAttribute: '_id',
    
    toJSON: function () {
      var obj = Model.__super__.toJSON.call(this),
        obj_type = obj_map[obj.type.toLowerCase()];
      
      if (obj_type) {
        obj.object_url = obj_type.url(obj);        
        obj.object_name = obj_type.name(obj);
      } else {
        obj.object_name = obj.name;
      }
 
      return obj;
    },
    
    parse: function (data, options) {
      data = Model.__super__.parse.call(this, data, options)
      data._id = this.createID(data);

      if (data.id) {
        data.orig_id = data.id;
        delete data.id;
      }
      
      return data;
    },
    
    createID: function (obj) {
      var id = obj.type + obj.name;
      if (obj.id) id += obj.id;
      return id;
    }
  });
  // Return the model for the module
  return Model;
});
