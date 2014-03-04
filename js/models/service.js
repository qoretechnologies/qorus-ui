define(function (require) {
  var _             = require('underscore'),
      $             = require('jquery'),
      settings      = require('settings'),
      Qorus         = require('qorus/qorus'),
      Notifications = require('collections/notifications'),
      Model;
  
  
  Model = Qorus.Model.extend({
    defaults: {
      threads: '-'
    },
    urlRoot: settings.REST_API_PREFIX + '/services/',
    idAttribute: "serviceid",
    allowedActions: ['load','unload','reset','setAutostart'],

    // get available actions
    actions: function () {
      var status = this.get('status'),
          actions = ['enable', 'disable'];
          
      if (status == 'unloaded') {
        actions.push('load');
      } else {
        actions.push('unload');
        actions.push('reset');
      }
        
      return actions;
    },
    
    api_events_list: [
      "service:%(id)s:start",
      "service:%(id)s:stop",
      "service:%(id)s:autostart_change",
      "service:%(id)s:alert_ongoing_raised",
      "service:%(id)s:alert_ongoing_cleared",
      "service:%(id)s:alert_transient_raised",
    ],
    
    dispatch: function (e, evt) {
      
    },

    doAction: function(action, opts, callback){
      var options = { action: action },
          url     = null,
          resp;
      
      _(options).extend(opts);

      if(_.indexOf(this.allowedActions, action) != -1){
        $.put(this.url(), options)
          .fail(
            function (data) {
              resp = data.responseJSON;
              Notifications.create({ group: 'services', type: 'error', title: resp.err, description: resp.desc, url: url });
              if (_.isFunction(callback)) {
                callback();
              }
          });
      }
    },
    
    setOption: function (opts) {
      $.put(this.url(), opts, null, 'application/json');
    },
    
    toJSON: function () {
      var json = Model.__super__.toJSON.apply(this, arguments);
      json.actions = this.actions();
      return json;
    },
    
    parse: function () {
      response = Model.__super__.parse.apply(this, arguments);
      response.has_alerts = (response.alerts.length > 0);
      return response;
    },
    
    getControls: function () {
      var item     = this.toJSON(),
          controls = [];
          
      if (item.enabled === true) controls.push({ action: 'disable', icon: 'off', title: 'Disable', css: 'success' });
      if (item.enabled === false) controls.push({ action: 'enable', icon: 'off', title: 'Enable', css: 'danger' });
      
      if (item.autostart) controls.push({ action: 'setAutostart', icon: 'rocket', title: "Disable autostart", css: 'success', data: { autostart: false} });
      if (!item.autostart) controls.push({ action: 'setAutostart', icon: 'rocket', title: "Enable autostart", css: '', data: { autostart: true } });
      
      if (item.status === 'unloaded') {
        controls.push({ action: 'load', icon: 'ban-circle', title: 'Load', css: '' });
      } else {
        controls.push({ action: 'unload', icon: 'ok', title: 'Unload', css: 'success'});
        controls.push({ action: 'reset', icon: 'refresh', title: 'Reset', css: 'warning' });
      }
  
      return controls;
    }
  });
  return Model;
});
