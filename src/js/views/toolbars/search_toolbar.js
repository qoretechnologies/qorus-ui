define(function (require) {
  require('bootstrap');
  
  var $             = require('jquery'),
      Backbone      = require('backbone'),
      _             = require('underscore'),
      Template      = require('tpl!templates/workflow/toolbars/search_toolbar.html'),
      BaseToolbar   = require('views/toolbars/toolbar'),
      Filters       = require('views/search/filters'),
      Autocomplete  = require('views/common/autocomplete'),
      CopyView      = require('views/common/table.copy'),
      Toolbar;
  
  var csv_options = {
    el: '#instances table',
    ignore: [0,1,2]
  };
  
  Toolbar = BaseToolbar.extend({
    fixed: true,
    template: Template,
    additionalEvents: {
      "click button[data-action='open']": "navigateTo",
      "click .toggle-search": "searchToggle"
      // 'submit .form-search': 'search',
      // 'keyup .search-query': 'search'
    },

    initialize: function (opts) {
      opts.search.qql = Filters.rebuild(opts.search);
      Toolbar.__super__.initialize.call(this, opts);
      _.extend(this.context, opts);
    },
    
    postInit: function () {
      this.setView(new CopyView({ csv_options: csv_options }), '#table-copy');
    },
    
    onRender: function () {
      Toolbar.__super__.onRender.apply(this, arguments);
      var dataset = _.map(Filters.getFilters(), function (v, k) { v.value = k; return v; });
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
    },
    
    searchToggle: function () {
      this.$('.simple-search').toggleClass('hide');
      this.$('.advanced-search').toggleClass('hide');
      this.$('.toggle-search').text(function () { 
        return ($(this).text()=="Advanced search") ? "Simple search" : "Advanced search"; 
      });
    }
  });
  return Toolbar;
});