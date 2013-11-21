define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!templates/toolbars/orders.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect'
], function($, _, Backbone, Qorus, Template, date, moment){
  var Toolbar = Qorus.View.extend({
    context: {
      predefined_statuses: [
        'Ready', 'Scheduled', 'Complete', 'Incomplete', 'Error', 'Canceled', 
        'Retry', 'Waiting', 'Async-Waiting', 'Event-Waiting', 'In-Progress', 
        'Blocked', 'Crash'
      ],
    },
    events: {
      "click button#status-filter": "statusFilter",
    },
    initialize: function(opts){
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      this.template = Template;
      this.on('render', this.datePicker, this);
      
      var _this = this;
      
      // add multiselect to statuses
      this.on('render', function(){});
      this.baseUrl = this.options.url;

      if (this.options.statuses){
        this.url = [this.baseUrl, this.options.statuses].join('/');
      }
      this.context.url = this.url;
      this.context.hasStatus = this.hasStatus;
      this.on('render', this.addMultiSelect);
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
      // $('.dp').datetimepicker({
      //     format: 'yyyy-mm-dd hh:ii:ss',
      // })
      // .on('changeDate', function(e){
      //     view.onDateChanged(e.date.toISOString(), {});
      // });
    },
    statusFilter: function(){
      var url = [this.baseUrl, this.options.statuses, this.options.date].join('/');
      Backbone.history.navigate(url);
    },
    onDateChanged: function(date) {
      var url = this.url + '/' + moment(date).utc().format('YYYY-MM-DD HH:mm:ss');
      Backbone.history.navigate(url);
    },
    addMultiSelect: function(){
      // var _this = this;
      // // apply bootstrap multiselect to #statuses element
      // $('#statuses').multiselect({
      //   onChange: function(el, checked){
      //     var sl = [], val = $(el).val();
      //     if(_this.options.statuses){
      //       sl = _this.options.statuses.split(',');
      //     }
      //     
      //     if(checked){
      //       sl.push(val);
      // 
      //       // check if alias for all and than check/uncheck all statuses
      //       if(val=='all'){
      //         $('option[value!="all"]', $(el).parent()).removeAttr('selected');
      //         sl = ['all'];
      //       } else {
      //         $('option[value="all"]', $(el).parent()).removeAttr('selected');
      //         sl = _.without(sl, 'all');
      //       }
      //     } else {
      //       if(val=='all'){
      //         $('option', $(el).parent()).removeAttr('selected');
      //       }else{
      //        sl = _.without(sl, val); 
      //       }
      //     }
      //     // refresh valudes
      //     $('#statuses').multiselect('refresh');
      //     _this.options.statuses = sl.join(',');
      //     _this.trigger('filter', _this.options.statuses);
      //   }
      // });
    }
  });
  return Toolbar;
});
