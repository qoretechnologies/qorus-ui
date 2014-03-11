define(function (require) {
  var Qorus        = require('qorus/qorus'),
      localStorage = require('localstorage'),
      utils        = require('utils'),
      Model;

  Model = Qorus.Model.extend({    
    dateAttributes: ['time',],

    parse: function(response, options){
      response = Model.__super__.parse.call(this, response, options);
      var cls = response.classstr.toLowerCase() || '';
      
      if(response.info){
        if (!response.info.id) response.info.id = response.info[cls + 'id'];
        response.info.cls = cls;
        response.info.status = response.info.status || "";
        response.info.instanceid = response.info[cls + '_instanceid'] || response.info['execid'] || "";
        response.info.desc = response.info.err || "";
        if(response.info.error){
          response.info.desc = response.info.error.err || "";
        }
      }
      
      if (response.id) {
        response.eventid = response.id;
      }

      // generate guid only if not already guid
      if (_.indexOf(response.id, '-') === -1) 
        response.id = utils.guid();

      return response
    },
    
    isNew: function () {
      return false;
    }
  });

  return Model;
});
