define(function (require) {
  var settings   = require('settings'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Model;

  Model = Qorus.Model.extend({
    model_cls: 'job',
    idAttribute: "jobid",
    urlRoot: settings.REST_API_PREFIX + '/jobs/',
    dateAttributes: ['last_executed', 'next'],
    allowed_actions: ['run', 'reset', 'set-expire', 'schedule', 'expiry_date', 'setActive', 'enable', 'disable'],
    
    api_events_list: [
      "job:%(id)s:start",
      "job:%(id)s:stop",
      "job:%(id)s:instance_stop",
      "job:%(id)s:alert_ongoing_raised",
      "job:%(id)s:alert_ongoing_cleared",
      "job:%(id)s:alert_transient_raised",
      "group:%(id)s:status_changed"
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
      
      if (obj === 'job') {
        if (action === 'start') {
          this.set('active', true);
        } else if (action === 'stop') {
          this.set('active', false);
        } else if (action === 'instance_stop') {
          this.incr(e.info.status);
        } else if (alert.test(action)) {
          console.log('getting alerts')
          this.getProperty('alerts', {}, true);
        }
      } else if (obj === 'group') {
        if (e.info.id === this.id && e.info.type === 'job') {
          this.set('enabled', e.info.enabled);
        }
      } 
      // debug.log(m.attributes);
      this.trigger('fetch');
    },
    
    doAction: function(action, opts){
      debug.log('doing action', action);
      if(_.indexOf(this.allowed_actions, action) != -1){
        var params = opts || {};
        _.extend(opts, {'action': action });
        debug.log(this.url());
        $.put(this.url(), params);
      }
    },
    
    parse: function (response) {
      response = Model.__super__.parse.apply(this, arguments);
      response.has_alerts = (response.alerts.length > 0);
      return response;
    },
    
    fetch: function (options) {
      options = options || {};
      
      if (!options.data) options.data = {};
      _.extend(options.data, { lib_source: true });
      
      Model.__super__.fetch.call(this, options);
    },
    
    getControls: function () {
      var item     = this.toJSON(),
          controls = [];
          
      if (item.enabled === true) controls.push({ action: 'disable', icon: 'off', title: 'Disable', css: 'success' });
      if (item.enabled === false) controls.push({ action: 'enable', icon: 'off', title: 'Enable', css: 'danger' });
      if (item.active) controls.push({ action: 'setActive', icon: 'ok', title: 'Deactivate', css: 'success', data: { active: false } });
      if (!item.active) controls.push({ action: 'setActive', icon: 'ban-circle', title: 'Activate', css: 'danger', data: { active: true } });
        
      return controls;
    }
  });

  return Model;
});
