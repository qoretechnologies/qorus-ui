define(function (require) {
  require('bootstrap.multiselect');
  
  var $           = require('jquery'),
      _           = require('underscore'),
      Backbone    = require('backbone'),
      Qorus       = require('qorus/qorus'),
      Template    = require('tpl!templates/workflow/toolbars/search_toolbar.html'),
      BaseToolbar = require('views/toolbars/toolbar'),
      Toolbar;
  
  Toolbar = BaseToolbar.extend({
    fixed: true,
    additionalEvents: {
      "click button[data-action='open']": "navigateTo"
      // 'submit .form-search': 'search',
      // 'keyup .search-query': 'search'
    },

    initialize: function (opts) {
      Toolbar.__super__.initialize.call(this, opts);
      
      this.template = Template;
      _.extend(this.context, opts);
    },
    
    navigateTo: function (e) {
      var el = $(e.currentTarget);
      if (el.data('url')){
        Backbone.history.navigate(el.data('url'), { trigger: true });
      }
    },
    
    search: function (e) {
      if (this.collection){
        this.collection.search(e); 
      }
      debug.log(this.options);
    }
  });
  return Toolbar;
});
