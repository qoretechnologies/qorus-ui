define(function (require) {
  require('bootstrap');
  
  var $            = require('jquery'),
      _            = require('underscore'),
      Template     = require('tpl!templates/workflow/toolbars/search_toolbar.html'),
      BaseToolbar  = require('views/toolbars/toolbar'),
      Filters      = require('views/search/filters'),
      Autocomplete = require('views/common/autocomplete'),
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
    
    onRender: function () {
      var dataset = _.map(Filters.FILTERS, function (v, k) { v.value = k; return v; });
      this.setView(new Autocomplete({ input: this.$('input.search-qql'), dataset: dataset }), 'autocomplete').render();
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
