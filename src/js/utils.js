define(function (require) {
  var _         = require('underscore'),
      moment    = require('moment'),
      settings  = require('settings'),
      $         = require('jquery');
  
  var utils = {
    settings: settings,
    status_map: {
      "waiting": "waiting",
      "async-waiting": "waiting",
      "event-waiting": "waiting",
      "error": "important",
      "in-progress": "warning",
      "complete": "success",
      "incomplete": "info",
      "canceled": "canceled",
      "retry": "error",
      "ready": "ready",
      "scheduled": "info",
      "success": "success"
    },
    action_icons: {
      "unload": "remove-circle",
      "load": "off",
      "reset": "refresh"
    },
    
    input_map: {
      'integer': ['input', 'number'],
      'bool': ['input', 'text'],
      'string': ['input', 'text']
    },
    data_types: {
      'integer': /\d+/,
      'string': /.*/,
      'date': /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
      'boolean': /(1|2|True|False)/i
    },
    
    parseDate: function (date, format) {
      var d;
      if (format===undefined){
          d = moment(date, settings.DATE_FORMAT);
      } else if (format===null){
          d = moment(date);
      } else {
          d = moment(date, format);
      }
            
      return d;
    },
    
    formatDate: function (date) {
        return date.format(settings.DATE_DISPLAY);
    },
    
    prepareDate: function (date) {
      var mdate;
      
      if (date === undefined || date === null || date === '24h') {
        mdate = moment().add('days', -1).format(settings.DATE_DISPLAY);
      } else if (date == 'all') {
        mdate = moment(settings.DATE_FROM).format(settings.DATE_DISPLAY);
      } else if (date.match(/^[0-9]+$/)) {
        mdate = moment(date, 'YYYYMMDDHHmmss').format(settings.DATE_DISPLAY);
      } else {
        mdate = date;
      }
      
      return mdate;
    },
    
    // getNextDate: function (cron_time) {
    //     var next = later().getNext(cronParser().parse(cron_time));
    //         
    //     return this.parseDate(next, null);
    // },
    
    getCurrentLocation: function () {
      return window.location.href;
    },
    
    getCurrentLocationPath: function () {
      return window.location.pathname;
    },
    
    parseURLparams: function () {
      var loc    = window.location.hash.slice(1), 
          params = [];

      _(loc.split(';')).each(function (param) {
        params.push(param.split(':'));
      });
      
      return params;
    },
    
    flattenSerializedArray: function (object, except) {
      // buggy when the object should be an array but has only one item selected it becomes a string
      var exclude = _.isArray(except) ? except : [except];
      var data = {};
      _.each(object, function(obj) {
        if (_.indexOf(exclude, obj.name) === -1) {
          if (_.has(data, obj.name)) {
            if (!_.isArray(data[obj.name])) {
              var old = data[obj.name];
              data[obj.name] = [old];
            }
            data[obj.name].push(obj.value);
          } else {
            data[obj.name] = obj.value; 
          }
        }
      });
      
      return data;
    },
    
    encodeDate: function (date) {
      var m  = moment(date, settings.DATE_DISPLAY);
      
      if (!m.isValid()) {
        m = moment();
      }
      return m.format('YYYYMMDDHHmmss');

    },
    
    prep: function (val, des) {
      if (_.isNumber(val)) {
        val = String('00000000000000' + val).slice(-14);
      } else  if (_.isString(val)) {
        val = val.toLowerCase();
      }
      if (des === true) {
        return '-' + val;
      }
      return val;
    },
    
    // Generate four random hex digits.
    S4: function () {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    guid: function () {
       return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
    },
    
    parseQuery: function (fragment) {
      if (fragment.indexOf('?') === -1) return {};
      var query = fragment.split('?')[1];
      var params = {};
      
      if (query.search(/^\s+/) !== -1) return {};
      
      _.each(query.split(/;|&/), function (pair) {
        pair = pair.split('=');
        params[pair[0]] = pair[1];
      });
      
      return params;
    },
    
    encodeQuery: function (query) {
      var equery = [];

      _.each(query, function (v, k) {
        if (k!=='')
          equery.push([k,v].join('='));
      });
      
      return equery.join('&');
    },
    
    flattenObj: function (obj, path, level, result) {
      level = level || 0;
      path = path || "/";
      result = result || [];
      var ctr = 1;
  
      _.each(obj, function (val, key) {
        var wal;
        if (_.isObject(val)) {
          wal = {
            key: key,
            value: "",
            path: path,
            level: level,
            node: true,
            leaf: false
          };
          result.push(wal);
          this.flattenObj(val, path + key + "/", level+1, result);
        } else {
          wal = {
            key: key,
            value: val,
            path: path,
            level: level,
            node: false,
            leaf: (_.keys(obj).length == ctr)
          };
          result.push(wal);
        }
        ctr++;
      }, this);
  
      return result;
    },
    
    validate: function (obj, type, regex) {
      var test;
      
      if (type in this.data_types)
        test = this.data_types[type];
        
      if (type === 'regex') test = regex;
      
      return obj.match(test);
    },
    
    tableToCSV: function (opts) {
      if (!opts && !opts.el) return 'Options or element not specified';
      var $el       = $(opts.el),
          ignore    = (opts.ignore) ? _(opts.ignore).clone().map(function (ig) { return ":eq("+ig+")"; }).join() : '',
          separator = opts.separator || ';',
          csv       = '';
      
      // create header
      if (opts.header) {
        csv += opts.header.join(separator);
      } else {
        csv += $el.find('thead').first().find('th').not(ignore).map(function (i, el) {
          return $(el).text().trim();
        }).get().join(separator);        
      }
      csv += "\n";
      
      // process rows
      $el.find('tbody tr:visible').each(function () {
        csv += $(this).find('td').not(ignore).map(function (i, el) {
          var val;
          
          if (_.has($(el).data(), 'value')) {
            val = $(el).data('value').toString();
          } else {
            val = $(el).text();
          }
          return val.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        }).get().join(separator);
        csv += "\n";
      });
      
      return csv.trim();
    }
  };
    
  return utils;
});