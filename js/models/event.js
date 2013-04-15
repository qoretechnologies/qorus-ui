define([
  'jquery',
  'backbone',
  'qorus/qorus',
  'sprintf',
  'jquery.rest'
], function($, Backbone, Qorus){
  var Model = Qorus.Model.extend({
    dateAttributes: ['time',],
    set: function(attributes, options){
      var attr = this.parse(attributes);
      Model.__super__.set.call(this, attr, options);
    },
    parse: function(response, options){
      response = Model.__super__.parse.call(this, response, options);
      var cls = response.classstr.toLowerCase();
      
      if(response.info){
        response.info.id = response.info[cls + 'id'];
        response.info.cls = cls;
        response.info.status = response.info.status || "";
        response.info.instanceid = response.info[cls + '_instanceid'] || response.info['execid'] || "";
        response.info.desc = response.info.err || "";
        if(response.info.error){
          response.info.desc = response.info.error.err || "";
        }
      }
      
      return response
    }
  });
  // Return the model for the module
  return Model;
});