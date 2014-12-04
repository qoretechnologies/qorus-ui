define(function (require) {
  var _       = require('underscore'),
      filters = require('collections/orders').prototype.search_params,
      FilterBase;
  
  FilterBase = {
    FILTERS: filters,
    
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
    
    rebuild: function (params) {
      var query = [];
      _.each(params, function (v, k) {
        var filter = _.find(this.FILTERS, { name : k });
        var lpos, rpos;
        if (filter) {
          lpos = filter.hint.indexOf('(') + 1;
          rpos = filter.hint.indexOf(')');
          query.push(filter.hint.slice(0,lpos) + v + filter.hint.slice(rpos));
        }
      }, this);
      
      return query.join(" ");
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