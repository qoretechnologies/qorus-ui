define(function (require) {
  var Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      _          = require('underscore'),
      helpers    = require('qorus/helpers'),
      Model, BaseParams, ObjectDetailAttributes;

  function extend(d, s) {
    var copy = _.clone(d);
    return _.extend(copy, s);
  }

  BaseParams = {
    "conntype": "string",
    "locked":	"boolean",
    "up": "boolean",
    "monitor": "boolean",
    "status": "string",
    "last_check": "date"
  };

  ObjectDetailAttributes = {
    'DATASOURCE':  extend(BaseParams, {
        "type": "string",
        "user": "string",
        "db": "string"
    }),
    'REMOTE': extend(BaseParams, {
        "loopback": "boolean",
        "updated": "date",
        "opts": "list",
        "url": "string"
      }),
    'USER-CONNECTION': extend(BaseParams, {
        "loopback": "boolean",
        "updated": "date",
        "opts": "list",
        "url": "string",
        "type": "string"
      })
  };


  Model = Qorus.ModelWithAlerts.extend({
    __name__: 'RemoteModel',
    idAttribute: 'name',
  
    // TODO: add api events for alerts updates
    api_events_list: [
      "remote:%(id)s:alert_ongoing_raised",
      "remote:%(id)s:alert_ongoing_cleared",
      "remote:%(id)s:alert_transient_raised"
    ],
    
    initialize: function () {
      Model.__super__.initialize.apply(this, arguments);
      this.listenTo(Dispatcher, this.api_events, this.dispatch);
    },
    
    parse: function (response) {
      Model.__super__.parse.apply(this, arguments);
      
      this.parseDeps(response.deps);
      return response;
    },
    
    parseDeps: function (deps) {
      _.each(deps, function (dep) {
        var type,
            desc = dep.desc.split(' ');
        
        if (desc.indexOf(dep.name) > 1) {
          type = desc[1];
        } else {
          type = desc[0];
        }
        
        type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        
        dep.url = helpers.getUrl('show'+type, { id: dep[type.toLowerCase()+'id']});
      }, this);
      return deps;
    },
    
    dispatch: function (e, evt) {
      if (e.info[this.idAttribute] !== this.id) return;
      
      var evt_types = evt.split(':'),
          obj = evt_types[0],
          id = evt_types[1],
          action = evt_types[2] || id,
          alert = /^(alert_).*/;
      
      if (obj === 'remote') {
        if (alert.test(action)) {
          this.fetch();
        }
      } 
      // debug.log(m.attributes);
      this.trigger('fetch');
    },

    doPing: function () {
      var self = this;
      $.put(this.url(), { 'action': 'ping' })
        .done(function (response) {
          self.trigger('ping', response);
        });
    },
    
    getDetails: function () {
      return ObjectDetailAttributes[this.get('conntype')];
    }
  });
  
  return Model;
});
