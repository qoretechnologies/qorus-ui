define(function (require) {
  require('bootstrap.multiselect');
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Template    = require('text!templates/job/toolbars/results_toolbar.html'),
      moment      = require('moment'),
      BaseToolbar = require('views/toolbars/toolbar'),
      Toolbar;
  
  var Toolbar = BaseToolbar.extend({
    fixed: false,
    datepicker: true,
    route: 'showJob',
    url_options: function () {
      return {
        id: this.options.id
      }
    },
    
    context: {
      predefined_statuses: [
        'Ready', 'Scheduled', 'Complete', 'Incomplete', 'Error', 'Canceled', 
        'Retry', 'Waiting', 'Async-Waiting', 'Event-Waiting', 'In-Progress', 
        'Blocked', 'Crash'
      ]
    },
    
    additionalEvents: {
      "click button#status-filter": "statusFilter",
      "click button[data-action='open']": "navigateTo",
    },
    
    initialize: function (opts) {
      Toolbar.__super__.initialize.call(this, opts);
      
      if (!_.has(opts, 'statuses')) {
        this.options.statuses = 'all';
      }
      
      this.template = Template;
      this.context.hasStatus = this.hasStatus;
      this.updateUrl();
    },
        
    onRender: function () {
      this.datePicker();
      this.addMultiSelect();
      // $('.sticky').sticky({ el: $('.sticky').parents('.pane') });
    },
    
    clean: function(){
      $('#statuses').multiselect('destroy');
    },
    
    updateStatuses: function(statuses){
      this.options.statuses = statuses;
    },
    
    updateUrl: function(url, statuses){
      var baseUrl = url || this.options.url;
      this.context.url = baseUrl;
    },
    
    
    // check the statuses for given status
    hasStatus: function (status){
      if (this.options.statuses){
        return _.indexOf(this.options.statuses.split(','), status) > -1;        
      }
      return false;
    },
    
    statusFilter: function(){
      var url = [this.baseUrl, this.options.statuses, this.options.date].join('/');
      Backbone.history.navigate(url, { trigger: true });
    },
    
    filterBE: function(e){
      var el = $(e.currentTarget);
      if(el.hasClass('active')){
        debug.log(this.url);
      } else {
        debug.log([this.url, 'true'].join('/'));
      }
    },
    
    onDateChanged: function(date) {
      var url = this.url + '/' + moment(date).utc().format('YYYYMMDDHHmmss');
      debug.log('date changed');
      Backbone.history.navigate(url, { trigger: true });
    },
    
    addMultiSelect: function(){
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
          debug.log(_this.options);
        }
      });
    },
    
    navigateTo: function (e) {
      var el = $(e.currentTarget);
      if (el.data('url')){
        Backbone.history.navigate(el.data('url'), {trigger: true});       
      }
    }
  });
  return Toolbar;
});
