define(function (require) {
  var $           = require('jquery'),
      _           = require('underscore'),
      utils       = require('utils'),
      Qorus       = require('qorus/qorus'),
      Template    = require('text!templates/workflow/toolbars/orders_toolbar.html'),
      BaseToolbar = require('views/toolbars/toolbar'),
      moment      = require('moment'),
      Toolbar;

  var Toolbar = BaseToolbar.extend({
    template: Template,
    datepicker: true,
    fixed: false,
    
    context: {
      predefined_statuses: [
        'Ready', 'Scheduled', 'Complete', 'Incomplete', 'Error', 'Canceled', 
        'Retry', 'Waiting', 'Async-Waiting', 'Event-Waiting', 'In-Progress', 
        'Blocked', 'Crash'
      ]
    },
    
    additionalEvents: {
      "click button#status-filter": "statusFilter",
      "click button[data-action='open']": "navigateTo"
    },
    
    initialize: function (opts) {
      Toolbar.__super__.initialize.call(this, opts);
      
      if (!_.has(opts, 'statuses')) {
        this.options.statuses = 'all';
      }
      
      this.context.hasStatus = this.hasStatus;
      this.updateUrl();
    },
        
    onRender: function () {
      Toolbar.__super__.onRender.apply(this, arguments);
      this.addMultiSelect();
    },
    
    clean: function () {
      $('#statuses').multiselect('destroy');
    },
    
    updateStatuses: function(statuses){
      this.options.statuses = statuses;
    },
    
    updateUrl: function(url, statuses){
      var baseUrl = url || this.options.url;
      this.baseUrl = baseUrl;
      statuses = statuses || this.options.statuses;
      this.updateStatuses(statuses);
      this.url = baseUrl;

      if (statuses){
        this.url = [baseUrl, statuses].join('/');
      }
      
      this.context.url = this.url;
      return this.url;
    },
    
    // check the statuses for given status
    hasStatus: function (status) {
      if (this.options.statuses){
        return _.indexOf(this.options.statuses.split(','), status) > -1;        
      }
      return false;
    },
    
    statusFilter: function () {
      var url = [this.baseUrl, this.options.statuses, utils.encodeDate(this.options.date)].join('/');
      Backbone.history.navigate(url, { trigger: true });
    },
    
    filterBE: function (e) {
      var el = $(e.currentTarget);
      if(el.hasClass('active')){
        debug.log(this.url);
      } else {
        debug.log([this.url, 'true'].join('/'));
      }
    },

    addMultiSelect: function () {
      var _this = this;
      // apply bootstrap multiselect to #statuses element      
      $('#statuses').multiselect({
        onChange: function(el, checked){
          var sl = [], val = $(el).val();
          if(_this.options.statuses){
            sl = _this.options.statuses.split(',');
          }
          
          if(checked){
            sl.push(val);

            // check if alias for all and than check/uncheck all statuses
            if(val=='all'){
              $('option[value!="all"]', $(el).parent()).removeAttr('selected');
              sl = ['all'];
            } else {
              $('option[value="all"]', $(el).parent()).removeAttr('selected');
              sl = _.without(sl, 'all');
            }
          } else {
            if(val=='all'){
              $('option', $(el).parent()).removeAttr('selected');
            }else{
             sl = _.without(sl, val); 
            }
          }
          // refresh valudes
          $('#statuses').multiselect('refresh');
          _this.options.statuses = sl.join(',');
          _this.trigger('filter', _this.options.statuses);
          debug.log("multiselect", _this.options);
        }
      });
    },
    
    search: function (e) {
      if (this.collection){
        this.collection.search(e); 
      }
    },
    
    applyDate: function (date) {
      var url;
      
      if (!moment(date).isValid()) return false;

      date = utils.encodeDate(date);
      
      url = this.updateUrl() + "/" + date;
      Backbone.history.navigate(url, {trigger: true});
    },
  });
  return Toolbar;
});
