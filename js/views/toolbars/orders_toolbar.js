define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!../../../templates/workflow/toolbars/orders_toolbar.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect',
  'jquery.sticky'
], function($, _, Backbone, Qorus, Template, date, moment){
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
      "click button[data-action='open']": "navigateTo",
      // 'submit .form-search': 'search',
      // 'keyup .search-query': 'search'
    },
    
    initialize: function (opts) {
      _.bindAll(this);
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
      $('.sticky').sticky({ el: $('.sticky').parents('.pane') });
    },
    
    clean: function(){
      $('.dp').datetimepicker('remove');
    },
    
    updateStatuses: function(statuses){
      this.options.statuses = statuses;
    },
    
    updateUrl: function(url, statuses){
      var baseUrl = url || this.options.url;
      this.baseUrl = baseUrl;
      var statuses = statuses || this.options.statuses;
      this.updateStatuses(statuses);
      this.url = baseUrl;

      if (statuses){
        this.url = [baseUrl, statuses].join('/');
      }
      
      this.context.url = this.url;
    },
    
    // check the statuses for given status
    hasStatus: function (status){
      if (this.options.statuses){
        return _.indexOf(this.options.statuses.split(','), status) > -1;        
      }
      return false;
    },
    
    // filter by date init
    datePicker: function(){
      var view = this;
      $('.dp').datetimepicker({
          format: 'yyyy-MM-dd hh:ii:ss',
          autoclose: true
      })
      .on('changeDate', function(e){
          view.onDateChanged(e.date.toISOString(), {});
      });
    },
    
    statusFilter: function(){
      var url = [this.baseUrl, this.options.statuses, this.options.date].join('/');
      Backbone.history.navigate(url, { trigger: true });
    },
    
    filterBE: function(e){
      var el = $(e.currentTarget);
      if(el.hasClass('active')){
        console.log(this.url);
      } else {
        console.log([this.url, 'true'].join('/'));
      }
    },
    
    onDateChanged: function(date) {
      var url = this.url + '/' + moment(date).utc().format('YYYY-MM-DD HH:mm:ss');
      console.log('date changed');
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
          console.log(_this.options);
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
      console.log(this.options);
    }
  });
  return Toolbar;
});
