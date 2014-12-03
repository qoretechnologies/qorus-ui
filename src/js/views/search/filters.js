define(function (require) {
  var _ = require('underscore'),
      FilterBase;
  
  FilterBase = {
    FILTERS: {
      ID: {
        name: 'ids',
        help: 'limit the search to one or more workflow_instanceids',
        hint:  'ID(id)'
      },
      WORKFLOWID: {
        name: 'workflowid',
        help: 'limit the search to one or more workflowids',
        hint:  'WORKFLOWID(id)'
      },
      STATUS: {
        name: 'status',
        help: 'limit the search to workflow instances with the given status value(s)',
        hint:  'STATUS(status)'
      },
      MAXMODIFIED: {
        name: 'maxmodified',
        help: 'give the upper modified date range for the error search',
        hint:  'MAXMODIFIED(date)'
      },
      MINMODIFIED: {
        name: 'modified',
        help: 'give the lower modified date range for the search',
        hint:  'MINMODIFIED(date)'
      },
      MAXSTARTED: {
        name: 'maxstarted',
        help: 'give the upper start date range for the search',
        hint:  'MAXSTARTED(date)'
      },
      MINSTARTED: {
        name: 'minstarted',
        help: 'give the lower start date range for the search',
        hint:  'MINSTARTED(date)'
      },
      DATEMOD: {
        name: ['modified', 'maxmodified'],
        help: 'limit the search to defined modified time range',
        hint:  'DATEMOD(mindate,maxdate)',
        parse: function (value) {
          return value.split(/\s|;|,/);
        }
      },
      DATE: {
        name: ['minstarted', 'maxstarted'],
        help: 'limit the search to defined start time range ',
        hint:  'DATE(mindate,maxdate)',
        parse: function (value) {
          return value.split(/\s|;|,/);
        }
      },
      KEYS: {
        name: ['keyvalue', 'keyname'],
        help: "the name of a search key to be used with the \\a keyvalue value(s)",
        hint:  'KEYS(keyvalue,keyname)',
        parse: function (value) {
          return value.split(/\s|;|,/);
        }
      }
    },
    
//    ALIASES: {
//      STARTED: 'MINSTARTED',
//      STARTEDMAX: 'MAXSTARTED',
//      MODIFIED: 'MINMODIFIED',
//      MODIFIEDMAX: 'MAXMODIFIED',
//      W: 'WORKFLOWID',
//      S: 'STATUS'
//    },
    
    parse: function (text) {
      var filter_list = text.split(/\s/), 
          filters = {};
      
      _.each(filter_list, function (filter) {
        var parsed = filter.match(/(.*[^\(])\((.*[^\)])\)/);

        if (parsed) filters[parsed[1]] = parsed[2];
      });

      return filters;
    },
    
    process: function (text) {
      var filters = this.parse(text),
          filters_processed = {};

      // createAliases
      this.mapAliases();
      
      _.each(filters, function (value, filter) {
        filter = filter.toUpperCase();
        if (_.has(this.FILTERS, filter)) {
          var f = this.FILTERS[filter], parsed_value;
          
          parsed_value = (f.parse) ? f.parse(value) : value;
          
          if (_.isString(f.name)) {
            filters_processed[f.name] = parsed_value;
          } else if (_.isArray(f.name)) {
            _.each(f.name, function (name, idx) {
              filters_processed[name] = parsed_value[idx];
            });
          }
        }
      }, this);
      
      return filters_processed;
    },
    
    mapAliases: function () {
      if (this.ALIASES) {
        _.each(this.ALIASES, function (filter, alias) {
          this.FILTERS[alias] = this.FILTERS[filter];
        }, this);        
      }
      return this;
    },
    
    getFilters: function() {
      if (this.ALIASES) {
        var key = _.keys(this.ALIASES)[0];
        if (!_.has(this.FILTERS, key)) {
            this.mapAliases();
        }        
      }

      return this.FILTERS;
    }
  };
  
  return FilterBase;
});