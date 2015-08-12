define(function (require) {
  var _             = require('underscore'),
      $             = require('jquery'),
      settings      = require('settings'),
      Qorus         = require('qorus/qorus'),
      Notifications = require('collections/notifications'),
      Dispatcher    = require('qorus/dispatcher'),
      Model;

  require('jquery.rest');  
  
  Model = Qorus.Model.extend({
    defaults: {
      threads: '-'
    },
    urlRoot: settings.REST_API_PREFIX + '/services/',
    idAttribute: "serviceid",
    allowedActions: ['load','unload','reset','setAutostart', 'enable', 'disable'],

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
      "group:%(id)s:status_changed",
    ],
    
    initialize: function () {
      Model.__super__.initialize.apply(this, arguments);
      this.listenTo(Dispatcher, this.api_events, this.dispatch);
    },
    
    dispatch: function (e, evt) {
      if (parseInt(e.info.id, 10) !== this.id) return;
      
      var evt_types = evt.split(':'),
          obj = evt_types[0],
          id = evt_types[1],
          action = evt_types[2] || id,
          alert = /^(alert_).*/;
      
      if (obj === 'service') {
        if (action === 'start') {
          this.set('status', 'loaded');
        } else if (action === 'stop') {
          this.set('status', 'unloaded');
        } else if (action === 'autostart_change') {
          this.set('autostart', e.info.autostart);
        } else if (alert.test(action)) {
          this.getProperty('alerts', {}, true);
        }
      } else if (obj === 'group') {
        if (e.info.id === this.id && e.info.type === 'service') {
          this.set('enabled', e.info.enabled);
        }
      } 
      // debug.log(m.attributes);
      this.trigger('fetch');
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
