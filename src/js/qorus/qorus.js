// Qorus core objects definition
define(function (require) {
  var $               = require('jquery'),
      _               = require('underscore'),
      Backbone        = require('backbone'),
      // localstorage = require('localstorage'),
      // DualStorage  = require('dualstorage'),
      settings        = require('settings'),
      utils           = require('utils'),
      Views           = require('qorus/views'),
      moment          = require('moment'),
      Qorus           = {},
      setNested, prep;

  require('sprintf');

  $.extend($.expr[':'], {
    'icontains': function (elem, i, match) //, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });

  prep = utils.prep;

  // this function pass function to nested objects
  setNested = function (obj, path, fn){
    var terms = path.split('.');
    if (terms.length > 1 && _.has(obj, terms[0])){
      var t = terms.shift();
      setNested(obj[t], terms.join('.'), fn);
    } else if(_.isObject(obj)) {
      var term = terms[0];
      if (_.has(obj, term)) {
        obj[term] = fn(obj[term]);
      } else {
        _.each(_.values(obj), function(v) {
          if (_.isObject(v)) {
            if (_.has(v, term)) {
              v[term] = fn(v[term]);
            }
          }
        });
      }
    }
  };

  Qorus.Model = Backbone.Model.extend({
    dateAttributes: {},
    api_events_list: [],
    nameAttribute: 'name',
    initialize: function (opts, options) {
      _.bindAll(this);
      opts = opts || {};

      if (_.has(opts, 'id')) {
        this.id = opts.id;
        delete opts.id;
      }

      Qorus.Model.__super__.initialize.call(this, [], opts, options);
      this.opts = opts;

      this.api_events = sprintf(_.result(this, 'api_events_list').join(' '), { id: this.id });
      // this.parseDates();
    },

    dispatch: function () {},

    parse: function (response) {
      _.each(this.dateAttributes, function (date) {
        if (date.search(/\./) > -1) {
            setNested(response, date, function(val) { if (val) { return moment(val, settings.DATE_FORMAT).format(settings.DATE_DISPLAY); }});
        } else {
          if (response[date]) {
            response[date] = moment(response[date], settings.DATE_FORMAT).format(settings.DATE_DISPLAY);
          }
        }
      });
      return response;
    },

    fetch: function (options) {
      var data = {};

      if (this.opts) {
        data.date = this.opts.date;
      }

      if (!options) {
        options = {};
      }

      if (options.data) {
        _.extend(data, options.data);
      }

      _.extend(options, {
        data: data,
        error: function syncError(model, response, options) {
                 model.trigger('sync:error', model, response, options);
               }
      });

      Qorus.Model.__super__.fetch.call(this, options);
      this.trigger('fetch', this);
      return this;
    },

    incr: function (attr, val) {
      val = val || 1;
      var value = parseInt(this.get(attr), 10);
      this.set(attr, value+val);
    },

    decr: function (attr, val) {
      val = val || 1;
      var value = parseInt(this.get(attr), 10) - val;

      this.set(attr, (value > 0) ? value : 0);
    },

    next: function () {
      if (!this.collection) return;

      return this.collection.next(this);
    },

    prev: function () {
      if (!this.collection) return;

      return this.collection.prev(this);
    },

    getConnections: function () {
      return this.get('connections');
    },

    hasConnections: function () {
      var cons = this.getConnections();

      if (_(cons).isArray()) return (cons.length > 0);

      return false;
    },

    getConnectionsStatus: function () {
      var cons;

      if (!this.hasConnections()) return undefined;

      cons = this.getConnections();
      return _(cons).findWhere({ up: false }) ? false : true;
    },

    // gets property from server
    getProperty: function (property, data, force) {
      var self   = this,
          silent = true;

      data = data || {};

      if (!this.get(property) || force === true) {
        $.get(_.result(this, 'url') + '/' + property, data)
          .done(function (data) {
            var atrs = {};
            atrs[property] = data;
            if (force === true) silent = false;
            self.set(atrs, { silent: silent });
            self.trigger('update:'+property, self);

            if (property === 'alerts') {
              self.set('has_alerts', self.get('alerts').length > 0);
            }
          });
      } else {
        return this.get(property);
      }
    },
    getName: function () {
      return this.get(this.nameAttribute);
    }
  });

  Qorus.ModelWithAlerts = Qorus.Model.extend({
    parse: function (response) {
      response = Qorus.ModelWithAlerts.__super__.parse.apply(this, arguments);
      if (_(response).has('alerts')) {
        response.has_alerts = (response.alerts.length > 0);
      } else {
        response.has_alerts = false;
      }

      return response;
    }
  });

  Qorus.Collection = Backbone.Collection.extend({
    local: false,
    date: null,
    limit: 100,
    offset: 0,
    page: 1,
    pagination: true,

    initialize: function (models, options) {
      _.bindAll(this);
      this.options = options || {};
      this.opts = this.options;

      if (this.options.date) {
        this.date = this.options.date;
      }

      this.on('fetch', function () { this._fetched = true; }, this);
    },

    search: function (query) {
      if (query === "") return this;

      var pattern = new RegExp(query, "gi");
      return _(this.filter(function (data) {
        return pattern.test(data.get("name"));
      }));
    },

    hasNextPage: function () {
      // debug.log("Has next page", (this.offset + this.limit - 2 < this.models.length), this.length, this.size());
      return this.pagination ? (this.offset + this.limit - 2 < this.models.length) : false;
    },

    loadNextPage: function () {
      // console.log('load next page?', this.hasNextPage());
      if (!this.loading) {
        this.loading = true;
        if (this.hasNextPage()) {

          this.offset = this.page * this.limit;
          // console.log('loading page', this.page, this.limit, this.offset);

          var self = this;
          this.fetch({
            remove: false,
            success: function () {
              debug.log("Fetched ->", self.length);
              // self.trigger('sync');
              self.loading = false;
              self.page++;
            }
          });
        }
      }
    },

    fetch: function (options) {
      this.trigger('pre:fetch', this);

      if (this.opts) {
        this.opts.limit = this.limit;
        this.opts.offset = this.offset;
      }

      var data = _.clone(this.opts) || {};

      if (!options) {
        options = {};
      }

      if (options.data) {
        _.extend(data, options.data);
      }

      data = _.clone(data);
      if (data.date) {
        data.date = moment(data.date, settings.DATE_DISPLAY).format(settings.DATE_TSEPARATOR);
      }

      // remove any Backbone.Model from data
      if (data) {
        _.each(data, function (d, k) {
          if (d instanceof Backbone.Model) {
            delete data[k];
          }
        });
      }

      _.extend(options, {
        data: data,
        error: function syncError(model, response, options) {
                 model.trigger('sync:error', model, response, options);
               }
      });

      options.reset = false;
      options.merge = true;

      Qorus.Collection.__super__.fetch.call(this, options);
      this.trigger('fetch', this);
      return this;
    },

    next: function (model) {
      var idx = this.indexOf(model) + 1;
      if (idx >= this.size()) return;

      return this.at(idx);
    },

    prev: function (model) {
      var idx = this.indexOf(model) - 1;
      if (idx < 0) return;

      return this.at(idx);
    }
  });

  Qorus.SortedCollection = Qorus.Collection.extend({
    sort_key: 'name',
    sort_order: 'asc',
    sort_history: [''],
    initialize: function (models, opts) {
      // this.sort_key = 'name';
      // this.sort_order = 'asc';
      // this.sort_history = [''];
      this.opts = opts || {};
      if (opts) {
        this.date = opts.date;
      }

      this.sort_key = this.opts.sort_key || this.sort_key;
      this.sort_order = this.opts.sort_order || this.sort_order;
      this.sort_history = this.opts.sort_history || this.sort_history;
    },

    comparator: function (c1, c2) {
      // needs speed improvements
      var k10 = prep(c1.get(this.sort_key)),
          k20 = prep(c2.get(this.sort_key)),
          r   = 1,
          k11, k21;

      if (this.sort_order === 'des') r = -1;

      if (k10 < k20) return -1 * r;
      if (k10 > k20) return 1 * r;

      k11 = prep(c1.get(this.sort_history[0]));
      k21 = prep(c2.get(this.sort_history[0]));

      if (k11 > k21) return -1 * r;
      if (k11 < k21) return 1 * r;
      return 0;
    },

    // comparator: function (m) {
    //   return [prep(m.get(this.sort_key)), prep(m.get(this.sort_history[0]))].join(', ');
    // },

    sortByKey: function (key, ord) {
      var old_key = this.sort_key;

      if (key) {
        if (old_key != key) {
          this.sort_history.unshift(old_key);
        }
        this.sort_order = ord;
        this.sort_key = key;

        // models = _.sortBy(models, function (m) {
        //   return [prep(m.get(key)), prep(m.get(old_key))].join(', ');
        // });
        this.sort({ silent: true });
        // if (this.sort_order === 'des') this.models.reverse();
        // this.models = models;

        // console.log('sorting', this.sort_order, this.sort_key);
        this.trigger('resort', this, {});
      }
    }
  });

  Qorus.WSCollection = Backbone.Collection.extend({
    local: true,
    remote: false,
    log_size: 1000,
    counter: 0,
    socket_url: null,
    auto_reconnect: true,
    max_retries: 10,
    retries: 0,

    initialize: function (models, opts) {
      opts = opts || {};
      _.bindAll(this);

      if (opts.auto_reconnect === false) {
        this.auto_reconnect = opts.auto_reconnect;
      }

      if (!opts.postpone) {
        this.connect();
      }
    },

    wsAdd: function (e) {
      var self = this;
      var models = JSON.parse(e.data);
      _.each(models, function (model) {
        var mdl = new self.model(model);
        debug.log("Adding -> ", mdl);
        self.add(mdl);
      });
    },

    connect: function () {
      var self = this;

      $.get(settings.REST_API_PREFIX + '/system?action=wstoken')
        .done(function (response) {
          self.token = response;
          self.wsOpen();
        })
        .fail(function () {
          debug.log('Failed to get token. Retrying.', self);
          self.wsRetry();
        });
    },

    wsClose: function () {
      if (this.socket) {
        debug.log("Closing WS", this.socket_url, this.socket);
        this.socket.onclose = function (e) { debug.log('Closed', e); };
        this.socket.close();
        this.socket = null;
        if (this.socketTimeout) {
          clearTimeout(this.socketTimeout);
        }
      }
    },

    wsOpen: function () {
      if (this.socket_url) {
        var url = this.socket_url + '?token=' + this.token;

        try {
          debug.log('Connecting to WS', url);
          this.socket = new WebSocket(url);
          this.socket.onmessage = this.wsAdd;
          this.socket.onclose = this.wsRetry;
          this.socket.onopen = this.wsOpened;
          this.socket.onerror = this.wsError;
        } catch (e) {
          debug.log(e);
        }
        this.socket.onerror = this.wsError;
      }
    },
    wsError: function (e) {
      debug.log(e);
    },

    wsOpened: function () {
      this.retries = 0;
      this.trigger('ws-opened', this);
    },

    wsRetry: function () {
      if (this.retries >= this.max_retries) return;

      this.trigger('ws-closed', this);

      if (this.auto_reconnect) {
        this.socketTimeout = setTimeout(this.connect, 5000);
      }
      this.retries++;
    },

    next: function (model) {
      var idx = this.indexOf(model) + 1;
      if (idx >= this.size()) return;

      return this.at(idx);
    },

    prev: function (model) {
      var idx = this.indexOf(model) - 1;
      if (idx < 0) return;

      return this.at(idx);
    }
  });

  Qorus.SortedWSCollection = Qorus.SortedCollection.extend({
    log_size: 1000,
    counter: 0,
    socket_url: null,
    auto_reconnect: true,

    initialize: function (opts) {
      opts = opts || {};
      _.bindAll(this);
      this.sort_key = 'time';
      this.sort_order = 'des';
      this.sort_history = [''];

      if (opts.auto_reconnect === false) {
        this.auto_reconnect = opts.auto_reconnect;
      }

      this.connect();
    },

    connect: function () {
      var self = this;

      $.get(settings.REST_API_PREFIX + '/system?action=wstoken')
        .done(function (response) {
          self.token = response;
          self.wsOpen();
        })
        .fail(function () {
          debug.log('Failed to get token. Retrying.', self);
          self.wsRetry();
        });
    },

    wsClose: function () {
      this.token = null;
      if (this.socket) {
        debug.log("Closing WS", this.socket_url, this.socket);
        this.socket.onclose = function (e) { debug.log('Closed', e); };
        this.socket.close();
      }
    },

    wsOpen: function () {
      if (this.socket_url) {
        var url = this.socket_url + '?token=' + this.token;

        try {
          debug.log('Connecting to WS', url);
          this.socket = new WebSocket(url);
          this.socket.onmessage = this.wsAdd;
          this.socket.onclose = this.wsRetry;
          this.socket.onopen = this.wsOpened;
          this.socket.onerror = this.wsError;
        } catch (e) {
          debug.log(e);
        }
        this.socket.onerror = this.wsError;
      }
    },

    wsAdd: function () {
      this.trigger('update', this);
    },

    wsError: function (e) {
      this.token = null;
      debug.log(e);
    },

    wsOpened: function () {
      this.trigger('ws-opened', this);
    },

    wsRetry: function () {
      if (this.retries >= this.max_retries) return;
      this.trigger('ws-closed', this);

      if (this.auto_reconnect) {
        setTimeout(this.connect, 5000);
      }
      this.retries++;
    }
  });

  var _navigate = Backbone.history.navigate;

  Backbone.history.navigate = function (route, options) {
    options = options || {};
    if (!options.trigger) {
      var query = utils.parseQuery(Backbone.history.fragment);
      _.extend(query, utils.parseQuery(route));

      // if (pos > 0) route = route.slice(0, pos);
      route.replace(/\?*/, "?" + utils.encodeQuery(query));
      // console.log(Backbone.history.fragment, route);
    }

    return _navigate.apply(this, arguments);
  };

  _.extend(Qorus, Views);

  return Qorus;
});
