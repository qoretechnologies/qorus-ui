define(function (require) {
  var Qorus   = require('qorus/qorus'),
      Helpers = require('qorus/helpers'),
      utils   = require('utils'),
      moment  = require('moment'),
      obj_map, Model;
  
  obj_map = {
    workflow: {
      name: function (obj) {
        return sprintf('%(name)s v%(version)s %(id)s', obj);
      },
      url: function (obj) {
        return Helpers.getUrl('showWorkflow', { id: obj.id });
      }
    },
    service: {
      name: function (obj) {
        return sprintf('%(name)s v%(version)s %(id)s', obj);
      },
      url: function (obj) {
        var url = [Helpers.getUrl('showServices'), obj.id].join('/');
        return url;
      }
    },
    job: {
      name: function (obj) {
        return sprintf('%(name)s v%(version)s %(id)s', obj);
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
  };
  
  Model = Qorus.Model.extend({
    defaults: {
      name: 'N/A',
      version: 'N/A'
    },
    
    dateAttributes: ['when'],
    // idAttribute: '_id',
    
    toJSON: function () {
      var obj = Model.__super__.toJSON.call(this),
        obj_type = obj_map[obj.type.toLowerCase()];
    
      if (obj_type) {
        obj.object_url = obj_type.url(obj);
        obj.object_name = obj_type.name(obj);
      } else {
        obj.object_name = obj.object;
      }
 
      return obj;
    },
    
    parse: function (data, options) {
      data = Model.__super__.parse.call(this, data, options);
      data.id = this.createID(data);
      
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
