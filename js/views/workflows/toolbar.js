define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!/templates/toolbars/orders.html',
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
    initialize: function(opts){
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      this.template = Template;
      this.on('render', this.datePicker, this);
      
      var _this = this;
      
      // add multiselect to statuses
      this.on('render', function() {
        $('.multiselect').multiselect({
          onChange: function(el, checked){
            var sl = [], val = $(el).val();
            if(_this.options.statuses){
              sl = _this.options.statuses.split(',');
            }
            
            if(checked){
              sl.push(val);
              if(val=='all'){
                $('option[value!="all"]', $(el).parent()).removeAttr('selected');
                sl = ['all'];
                // $('.multiselect').multiselect('refresh');
              }
            } else {
              if(val=='all'){
                $('option', $(el).parent()).removeAttr('selected');
                // $('.multiselect').multiselect('refresh');
              }else{
               sl = _.without(sl, val); 
               console.log(sl);
              }
            }

            _this.options.statuses = sl.join(',');
            _this.trigger('filter', _this.options.statuses);
          }
        });
      }, this);
      this.url = this.options.url;

      if (this.options.statuses){
        this.url += '/' + this.options.statuses;
      }
      this.context.url = this.url;
      this.context.hasStatus = this.hasStatus;
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
          format: 'yyyy-MM-dd hh:mm:ss',
      })
      .on('changeDate', function(e){
          view.onDateChanged(e.date.toISOString(), {});
      });
    },
    onDateChanged: function(date) {
      var url = this.url + '/' + moment(date).utc().format('YYYY-MM-DD HH:mm:ss');
      Backbone.history.navigate(url);
    },
  });
  return Toolbar;
});
