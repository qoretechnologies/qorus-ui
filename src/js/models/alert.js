define(function (require) {
  var _       = require('underscore'),
      Qorus   = require('qorus/qorus'),
      Helpers = require('qorus/helpers'),
      obj_map, Model;
  
  obj_map = {
    workflow: {
      name: function (obj) {
        return sprintf('%(name)s v%(version)s %(_id)s', obj);
      },
      url: function (obj) {
        return Helpers.getUrl('showWorkflow', { id: obj._id });
      }
    },
    service: {
      name: function (obj) {
        return sprintf('%(name)s v%(version)s %(_id)s', obj);
      },
      url: function (obj) {
        var url = [Helpers.getUrl('showServices'), obj._id].join('/');
        return url;
      }
    },
    job: {
      name: function (obj) {
        return sprintf('%(name)s v%(version)s %(_id)s', obj);
      },
      url: function (obj) {
        return Helpers.getUrl('showJob', { id: obj._id });
      }
    },
    group: {
      name: function (obj) {
        return sprintf('%(name)s', obj);
      },
      url: function (obj) {
        return Helpers.getUrl('showGroup', { name: obj.name });
      }
    },
    "user-connection": {
      name: function (obj) {
        return sprintf('%(name)s', obj);
      },
      url: function (obj) {
        return [Helpers.getUrl('showSystem'), 'remote', 'user', obj.name].join('/');
      }
    },
    datasource: {
      name: function (obj) {
        return sprintf('%(name)s', obj);
      },
      url: function (obj) {
        return [Helpers.getUrl('showSystem'), 'remote', 'datasource', obj.name].join('/');
      }
    },
    remote: {
      name: function (obj) {
        return sprintf('%(name)s', obj);
      },
      url: function (obj) {
        return [Helpers.getUrl('showSystem'), 'remote', 'remote', obj.name].join('/');
      }
    }
  };
  
  Model = Qorus.Model.extend({
    defaults: {
      name: 'N/A',
      version: 'N/A'
    },
    
    dateAttributes: ['when'],
    idAttribute: 'alertid',
    
    api_events_list: function () {
      var events;
      
      if (this.get('alerttype') === 'ONGOING') {
        events = [
          "alert:%(id)s:ongoing_cleared"
        ];
      } else {
        events = [
          "alert:%(id)s:transient_cleared"
        ];
      }
      
      return events;
    },
    
    toJSON: function () {
      var obj = Model.__super__.toJSON.call(this),
          obj_type;
        
      if (_.isString(obj.type)) obj_type = obj_map[obj.type.toLowerCase()];
    
      if (obj_type) {
        obj.object_url = obj_type.url(obj);
        obj.object_name = obj_type.name(obj);
      } else {
        obj.object_name = obj.object;
      }
 
      return obj;
    },
    
    dispatch: function () {},
    
    parse: function (data, options) {
      data = Model.__super__.parse.call(this, data, options);
      data._id = data.id;
      if (data.id) delete data.id;
      // data.id = this.createID(data);
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
