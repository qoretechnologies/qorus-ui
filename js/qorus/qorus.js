// Qorus core objects definition
define([
  'jquery',
  'underscore',
  'backbone',
  'settings',
  'utils',
  'qorus/views'
], function ($, _, Backbone, settings, utils, Views) {
  $.extend($.expr[':'], {
    'icontains': function (elem, i, match) //, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
  
  function prep(val, des) {
    if (_.isNumber(val)) {
      val = String('00000000000000' + val).slice(-14);
    } else  if (_.isString(val)) {
      val = val.toLowerCase();
    }
    if (des === true) {
      return '-' + val;
    }
    return val;
  }
  
  var Qorus = {};

  
  // this function pass function to nested objects
  var setNested = function (obj, path, fn){
    var terms = path.split('.');
    if (terms.length > 1 && _.has(obj, terms[0])){
      var t = terms.shift();
      setNested(obj[t], terms.join('.'), fn);
    } else if(_.isObject(obj)) {
      var term = terms[0];
      if (_.has(obj, term)) {
        obj[term] = fn(obj[term]); 
      } else {
        _.each(_.values(obj), function(v, k, l) {
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
    initialize: function (opts) {
      _.bindAll(this);
      opts = opts || {};

      if (_.has(opts, 'id')) {
        this.id = opts.id;
        delete opts.id;
      }
      
      Qorus.Model.__super__.initialize.call(this, opts);
      this.opts = opts;
      // this.parseDates();
    },
    
    parse: function (response, options) {
      _.each(this.dateAttributes, function (date) {
        if (date.search(/\./) > -1) {
            setNested(response, date, function(val) { if (val) { return moment(val, settings.DATE_FORMAT).format(settings.DATE_DISPLAY); }})
        } else {
          if (response[date]) {
            response[date] = moment(response[date], settings.DATE_FORMAT).format(settings.DATE_DISPLAY); 
          }          
        }
      });
      return response;
    },
    
    fetch: function (options) {
      var data = {}; //this.opts;  

      if (!options) {
        options = {};
      }

      if (options.data) {
        _.extend(data, options.data);
      }
      
      _.extend(options, { data: data });
      Qorus.Model.__super__.fetch.call(this, options);
      this.trigger('fetch', this);
    }
  });

  Qorus.Collection = Backbone.Collection.extend({
    date: null,
    limit: 100,
    offset: 0,
    page: 1,
    
    initialize: function (date) {
      // _.bindAll(this);
      if (date) {
        this.date = date;
      }
    },
    
    search: function (query) {
      if (query === "") return this;

      var pattern = new RegExp(query, "gi");
      return _(this.filter(function (data) {
        return pattern.test(data.get("name"));
      }));
    },
    
    hasNextPage: function () {
      // console.log("Has next page", (this.offset + this.limit - 2 < this.models.length), this.length, this.size());
      return (this.offset + this.limit - 2 < this.models.length); 
    },
    
    loadNextPage: function () {
      if (!this.loading) {
        this.loading = true;
        if (this.hasNextPage()) {

          this.offset = this.page * this.limit;
          this.page++;
          console.log('loading page', this.page, this.limit, this.offset);

          var _this = this;
          this.fetch({ 
            remove: false,
            success: function () {
              console.log("Fetched ->", _this.length);
              _this.trigger('sync');
              _this.loading = false;
            }
          });
        }        
      }
    },
    
    fetch: function (options) {
      this.opts.limit = this.limit;
      this.opts.offset = this.offset;

      var data = this.opts;      

      if (!options) {
        options = {};
      }

      if (options.data) {
        _.extend(data, options.data);
      }
      
      _.extend(options, { data: data });
      
      console.log(this, options);
      
      Qorus.Collection.__super__.fetch.call(this, options);
    }
    
  });
  
  Qorus.SortedCollection = Qorus.Collection.extend({
    initialize: function (opts) {
      console.log(this);
      this.sort_key = 'name';
      this.sort_order = 'asc';
      this.sort_history = [''];
      this.opts = opts;
      if (opts) {
        this.date = opts.date;
      }
    },
    
    comparator: function (c1, c2) {
      // needs fix
      var r = (this.sort_order == 'des') ? -1 : 1;
      var k1 = [prep(c1.get(this.sort_key)), prep(c1.get(this.sort_history[0]))];
      var k2 = [prep(c2.get(this.sort_key)), prep(c2.get(this.sort_history[0]))];
      
      if (k1[0] < k2[0]) return -1 * r;
      if (k1[0] > k2[0]) return 1 * r;
      if (k1[1] > k2[1]) return -1 * r;
      if (k1[1] < k2[1]) return 1 * r;
      return 0;
    },
    
    sortByKey: function (key, ord, cb) {
      if (key) {
        var old_key = this.sort_key;
        if (old_key != key) {
          this.sort_history.unshift(old_key); 
        }
        this.sort_order = ord;
        this.sort_key = key;
        this.sort({
          silent: true
        });

        this.trigger('resort', this, {});
      }
    }
  });
  
  Qorus.WSCollection = Backbone.Collection.extend({
    initialize: function (models, options) {
      _.bindAll(this);
      var host = window.location.host
      this.socket = new WebSocket("ws://" + host);
      this.socket.onmessage = this.wsAdd;
    },
    
    wsAdd: function (e) {
      var _this = this;
      var models = JSON.parse(e.data);
      _.each(models, function (model) {
        var mdl = new _this.model(model);
        console.log("Adding -> ", mdl);
        _this.add(mdl);
      });
    },
    
    sync: function () {
    },
    
    fetch: function () {
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
      var _this = this;
      
      $.get(settings.REST_API_PREFIX + '/system?action=wstoken')
        .done(function (response) {
          _this.token = response;
          _this.wsOpen();
        })
        .fail(function () {
          console.log('Failed to get token. Retrying.', _this);
          _this.wsRetry();
        });
    },
    
    wsClose: function () {
      if (this.socket) {
        console.log("Closing WS", this.socket_url, this.socket);
        this.socket.onclose = function (e) { console.log('Closed', e); };
        this.socket.close(); 
      }
    },

    wsOpen: function () {
      if (this.socket_url) {
        var url = this.socket_url + '?token=' + this.token;
      
        try {
          console.log('Connecting to WS', url);
          this.socket = new WebSocket(url); 
          this.socket.onmessage = this.wsAdd;
          this.socket.onclose = this.wsRetry;
          this.socket.onopen = this.wsOpened;
          this.socket.onerror = this.wsError;
        } catch (e) {
          console.log(e);
        }
        this.socket.onerror = this.wsError; 
      }
    },

    wsAdd: function (e) {
      this.trigger('update', this);
    },

    wsError: function (e) {
      console.log(e);
    },

    wsOpened: function () {
      this.trigger('ws-opened', this); 
    },

    wsRetry: function () {
      this.trigger('ws-closed', this);
      
      if (this.auto_reconnect) {
        setTimeout(this.connect, 5000); 
      }
    },
    
    sync: function () {
    },
    
    fetch: function () {
    }
  });
  
  _.extend(Qorus, Views);

  return Qorus;
});
