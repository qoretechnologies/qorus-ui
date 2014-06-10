define(function (require) {
  var settings   = require('settings'),
      Qorus      = require('qorus/qorus'),  
      Model      = require('models/order'),
      Dispatcher = require('qorus/dispatcher'),
      Collection;
  
   Collection = Qorus.SortedCollection.extend({
    model: Model,
    url: function () {
      return settings.REST_API_PREFIX + '/workflows/'+ this.workflowid + '/orders/';
    },
    
    api_events_list: [
      "workflow:data_submitted",
      "workflow:status_changed"
    ],
    
    api_events_list_id: [
      "workflow:%(workflowid)s:data_submitted",
      "workflow:%(workflowid)s:status_changed",
      "workflow:%(workflowid)s:data_error"
    ],
    
    initialize: function (models, opts) {
      Collection.__super__.initialize.call(this, arguments);
      
      if (!opts.date) {
        opts.date = this.date;
      }
      
      this.opts = opts;
      this.opts.sort = 'started';
      
      if (opts.workflowid) {
        this.workflowid = opts.workflowid; 
        delete this.opts.workflowid;
      } else {
        this.url = settings.REST_API_PREFIX + '/orders/';
      }

      if (this.opts.statuses == 'all' || !this.opts.statuses) {
        delete this.opts.statuses;
      }
      
      // parse search values
      if (this.opts.search) {
        var ids = this.opts.search.ids ? this.opts.search.ids.split(/[, ]+/) : '';
        var keyvalues = this.opts.search.keyvalues ? this.opts.search.keyvalues.split(/[, ]+/) : '';
        
        if (ids.length > 0)
          this.opts.ids = ids.join(',');
        
        if (keyvalues.length > 0) 
          this.opts.keyvalue = keyvalues.join(',');
        
        delete this.opts.search;
      }

      delete this.opts.url;
      
      if (this.workflowid) {
        this.api_events = sprintf(this.api_events_list_id.join(' '), { id: this.id, workflowid: this.workflowid });
      } else {
        this.api_events = sprintf(this.api_events_list.join(' '), { id: this.id, workflowid: this.get('workflowid') });
      }

      this.listenTo(Dispatcher, this.api_events, this.dispatch);
    },
    
    dispatch: function (e, evt) {
      if (e === 'data_submitted') {
        this.add(e.info);
      }
    }
  });
  return Collection;
});
