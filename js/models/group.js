define([
  'settings',
  'underscore',
  'qorus/qorus'
], function(settings, _, Qorus){
  var Model = Qorus.Model.extend({
    urlRoot: settings.REST_API_PREFIX + '/groups/',
    allowed_actions: ['setStatus'],
    
    url: function () {
      return this.urlRoot + this.get('name');
    },
    
    doAction: function(action, opts){
      if(_.indexOf(this.allowed_actions, action) != -1){
        var params = opts || {};
        _.extend(opts, {'action': action });
        $.put(this.url(), params);
      }
    }
  });
  // Return the model for the module
  return Model;
});