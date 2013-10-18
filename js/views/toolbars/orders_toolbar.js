define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'qorus/qorus',
  'text!../../../templates/workflow/toolbars/orders_toolbar.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect',
  'jquery.sticky'
], function($, _, Backbone, utils, Qorus, Template, date, moment){
  var Toolbar = Qorus.View.extend({
    context: {
      predefined_statuses: [
        'Ready', 'Scheduled', 'Complete', 'Incomplete', 'Error', 'Canceled', 
        'Retry', 'Waiting', 'Async-Waiting', 'Event-Waiting', 'In-Progress', 
        'Blocked', 'Crash'
      ]
    },
    
    events: {
      "click button#status-filter": "statusFilter",
      "click button[data-action='open']": "navigateTo"
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      debug.log('initializing toolbar', this.cid);
      
      if (!_.has(opts, 'statuses')) {
        this.options.statuses = 'all';
      }
      
      this.template = Template;
      this.context.hasStatus = this.hasStatus;
      this.updateUrl();
      this.date = this.options.date;
    },
        
    onRender: function () {
      this.datePicker();
      this.addMultiSelect();
      // $('.sticky').sticky({ el: $('.sticky').parents('.pane') });
    },
    
    clean: function () {
      // debug.error('cleaning toolbar', this.dp);
      $('.dp').datetimepicker('remove');
      $('#statuses').multiselect('destroy');
      this.dp.remove();
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
    },
    
    // check the statuses for given status
    hasStatus: function (status) {
      if (this.options.statuses){
        return _.indexOf(this.options.statuses.split(','), status) > -1;        
      }
      return false;
    },
    
    // filter by date init
    datePicker: function () {
      var view = this;
      this.dp = $('.dp').datetimepicker({
          format: 'yyyy-MM-dd hh:ii:ss',
          autoclose: true
      })
      .on('changeDate', function(e){
          view.onDateChanged(e.date.toISOString(), {});
      });
    },
    
    statusFilter: function () {
      var url = [this.baseUrl, this.options.statuses, utils.encodeDate(this.date)].join('/');
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
    
    onDateChanged: function (date) {
      var url = this.url + '/' + moment(date).utc().format('YYYYMMDDHHmmss');
      Backbone.history.navigate(url, { trigger: true });
      this.off();
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
    
    navigateTo: function (e) {
      var el = $(e.currentTarget);
      if (el.data('url')){
        Backbone.history.navigate(el.data('url'), {trigger: true});       
      }
    },
    
    search: function (e) {
      if (this.collection){
        this.collection.search(e); 
      }
    }
  });
  return Toolbar;
});
