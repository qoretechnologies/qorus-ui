define(function (require) {
  var $           = require('jquery'),
      _           = require('underscore'),
      Backbone    = require('backbone'),
      utils       = require('utils'),
      settings    = require('settings'),
      Template    = require('text!templates/workflow/toolbars/orders_toolbar.html'),
      BaseToolbar = require('views/toolbars/toolbar'),
      moment      = require('moment'),
      Toolbar, status;
      
  status = [
    'Ready', 'Scheduled', 'Complete', 'Incomplete', 'Error', 'Canceled', 
    'Retry', 'Waiting', 'Async-Waiting', 'Event-Waiting', 'In-Progress', 
    'Blocked', 'Crash'
  ];

  Toolbar = BaseToolbar.extend({
    context: {},
    template: Template,
    datepicker: true,
    fixed: false,
        
    additionalEvents: {
      "click button#status-filter": "statusFilter",
      "click button[data-action='open']": "navigateTo"
    },
    
    url: function (opts) {
      opts = opts || {};
      var date     = opts.date || this.options.date,
          statuses = opts.statuses || this.options.statuses;
          
      if (date !== 'all') date = utils.encodeDate(date);

      this.fixUpstreamUrl();
      return "/" + ['orders', statuses, date].join('/');
    },
    
    initialize: function (opts) {
      _.bindAll(this);

      Toolbar.__super__.initialize.call(this, opts);

      _.extend(this.context, {
        predefined_statuses: status,
        hasStatus: this.hasStatus,
        url: this.getViewUrl,
        getAllUrl: this.getAllUrl,
        get24hUrl: this.get24hUrl
      });
      
      if (!_.has(opts, 'statuses')) {
        this.options.statuses = 'all';
      }

      this.updateUrl();
    },
    
    fixUpstreamUrl: function () {
      var url = this.upstreamUrl.split('/').splice(0,4).join('/');
      this.upstreamUrl = url;
      return url;
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
      
      return this.getViewUrl();
    },
    
    // check the statuses for given status
    hasStatus: function (status) {
      if (this.options.statuses){
        return _.indexOf(this.options.statuses.split(','), status) > -1;        
      }
      return false;
    },
    
    getAllUrl: function () {
      var url = this.url({ date: 'all' });
      return this.fixUpstreamUrl() + url;
    },

    get24hUrl: function () {
      var url = this.url({ date: moment().add('days',-1).format(settings.DATE_FORMAT) });
      return this.fixUpstreamUrl() + url;
    },

    statusFilter: function () {
      Backbone.history.navigate(this.getViewUrl(), { trigger: true });
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
    }
  });
  return Toolbar;
});
