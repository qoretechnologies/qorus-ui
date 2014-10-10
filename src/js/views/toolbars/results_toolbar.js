define(function (require) {
  require('bootstrap.multiselect');
  var $           = require('jquery'),
      _           = require('underscore'),
      Backbone    = require('backbone'),
      Template    = require('text!templates/job/toolbars/results_toolbar.html'),
      moment      = require('moment'),
      BaseToolbar = require('views/toolbars/toolbar'),
      settings    = require('settings'),
      utils       = require('utils'),
      CopyView    = require('views/common/table.copy'),
      Toolbar, status;
  
  status =  ['Complete', 'Error'];
  
  var csv_options = {
    el: "#result-list table",
    ignore: [0]
  };
  
  Toolbar = BaseToolbar.extend({
    template: Template,
    fixed: false,
    datepicker: true,
    route: 'showJob',
    url_options: function () {
      return {
        id: this.options.id
      };
    },
    
    url: function (opts) {
      var date, statuses;
      
      opts     = opts || {};
      date     = opts.date || this.options.date;
      statuses = opts.statuses || this.options.statuses;
          
      if (date !== 'all') date = utils.encodeDate(date);

      this.fixUpstreamUrl();
      return "/" + [statuses, date].join('/');
    },
    
    additionalEvents: {
      "click button#status-filter": "statusFilter",
      "click button[data-action='open']": "navigateTo"
    },
    
    initialize: function (opts) {
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
    
    postInit: function () {
      this.setView(new CopyView({ csv_options: csv_options }), '#table-copy');
    },

    // check the statuses for given status
    hasStatus: function (status) {
      if (this.options.statuses){
        return _.indexOf(this.options.statuses.split(','), status) > -1;        
      }
      return false;
    },

    onRender: function () {
      // this.datePicker();
      this.addMultiSelect();
      // $('.sticky').sticky({ el: $('.sticky').parents('.pane') });
    },
    
    clean: function(){
      $('#statuses').multiselect('destroy');
    },
    
    fixUpstreamUrl: function () {
      var url = this.upstreamUrl.split('/').splice(0,4).join('/');
      this.upstreamUrl = url;
      return url;
    },
    
    getAllUrl: function () {
      var url = this.url({ date: 'all' });
      return this.fixUpstreamUrl() + url;
    },

    get24hUrl: function () {
      var url = this.url({ date: moment().add('days',-1).format(settings.DATE_FORMAT) });
      return this.fixUpstreamUrl() + url;
    },
    
    updateStatuses: function(statuses){
      this.options.statuses = statuses;
    },
    
    updateUrl: function(url){
      var baseUrl = url || this.options.url;
      this.context.url = baseUrl;
    },
    
    statusFilter: function () {
      Backbone.history.navigate(this.getViewUrl(), { trigger: true });
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
      var self = this;
      // apply bootstrap multiselect to #statuses element
      $('#statuses').multiselect({
        onChange: function(el, checked){
          var sl = [], val = $(el).val();
          if(self.options.statuses){
            sl = self.options.statuses.split(',');
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
          self.options.statuses = sl.join(',');
          self.trigger('filter', self.options.statuses);
          debug.log(self.options);
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
