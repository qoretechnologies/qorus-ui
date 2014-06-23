define(function (require) {
  var _ = require('underscore'),
      FilterBase;
  
  FilterBase = {
    FILTERS: {
      ERROR: {
        name: 'error',
        help: "the error text to search (can also include '%' characters for use with the LIKE operator; in this case only 1 value can be given)"
      },
      ERRORID: {
        name: 'error_instanceid',
        help: "limit the search to one or more error_instanceids"
      },
      DESCRIPTION: {
        name: 'description',
        help: "the description text to search (can also include '%' characters for use with the LIKE operator; in this case only 1 value can be given)"
      },
      INFO: {
        name: 'info',
        help: "the info text to search (can also include '%' characters for use with the LIKE operator; in this case only 1 value can be given"
      },
      STEPID: {
        name: 'stepid',
        help: 'limit the search to one or more stepids'
      },
      STEPNAME: {
        name: 'stepname',
        help: 'limit the search to one or more step names'
      },
      SEVERITY: {
        name: 'severity',
        help: 'limit the search to one or more severity values'
      },
      VERSION: {
        name: 'version',
        help: 'limit the search to one or more step versions'
      },
      RETRY: {
        name: 'retry',
        help: 'limit the search to errors with or without the retry flag'
      },
      BUSINESSERROR: {
        name: 'business_error',
        help: 'limit the search to errors with or without the business_error flag'
      },
      ID: {
        name: 'workflow_instanceid',
        help: 'limit the search to one or more workflow_instanceids'      
      },
      WORKFLOWID: {
        name: 'workflowid',
        help: 'limit the search to one or more workflowids'
      },
      WORKFLOWSTATUS: {
        name: 'workflowstatus',
        help: 'limit the search to workflow instances with the given status value(s)'
      },
      MAXDATE: {
        name: 'maxdate',
        help: 'give the upper date range for the error search'
      },
      MINDATE: {
        name: 'mindate',
        help: 'give the lower date range for the error search'
      },
      DATE: {
        name: ['mindate', 'maxdate'],
        help: 'limt the search to defined time range',
        parse: function (value) {
          return value.split(/\s|;|,/);
        }
      }
    },
    
    ALIASES: {
      MD: 'MINDATE',
      XD: 'MAXDATE',
      BE: 'BUSINESSERROR',
      V: 'VERSION',
      E: 'ERROR',
      EID: 'ERRORID',
      W: 'WORKFLOWID',
      WS: 'WORKFLOWSTATUS',
      S: 'STEPID',
      SN: 'STEPNAME',
      I: 'INFO',
      SV: 'SEVERITY',
      D: 'DESCRIPTION',
    },
    
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
      _.each(this.ALIASES, function (filter, alias) {
        this.FILTERS[alias] = this.FILTERS[filter];
      }, this);
      return this;
    }
  };
  
  return FilterBase;
});