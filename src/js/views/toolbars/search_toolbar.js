define(function (require) {
  require('bootstrap');
  // require('libs/typeahead/typeahead');
  
  var $           = require('jquery'),
      _           = require('underscore'),
      Template    = require('tpl!templates/workflow/toolbars/search_toolbar.html'),
      BaseToolbar = require('views/toolbars/toolbar'),
      Filters     = require('views/search/filters'),
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
    
    // onRender: function () {
    //   // $('input.search-qql').typeahead({
    //   //   source: _.map(Filters.mapAliases().FILTERS, function (v, k) { return k + '()' }),
    //   //   matcher: function (item) {
    //   //     var query = this.query.match(/(?=[^\s]*$)(.*)/)[1];
    //   //     return ~item.toLowerCase().indexOf(query);
    //   //   },
    //   //   updater: function (item) {
    //   //
    //   //   }
    //   // });
    //   var data = _.map(Filters.mapAliases().FILTERS, function (v, k) { v.val = k; return v; });
    //
    //   var engine = new Bloodhound({
    //     name: 'functions',
    //     local: data,
    //     datumTokenizer: function(d) {
    //       return Bloodhound.tokenizers.obj.whitespace('val');
    //     },
    //     queryTokenizer: Bloodhound.tokenizers.whitespace
    //   });
    //
    //   engine.initialize();
    //   console.log($('input.search-qql'));
    //   $('input.search-qql').typeahead({
    //     displayKey: 'val',
    //     // source: engine.ttAdapter()
    //     source: function (q, cb) {
    //       var matches = [],
    //           ptr     = new RexExp(q, 'i');
    //
    //       _.each(data, function (v, k) {
    //         if (ptr.test(k)) {
    //           v.val = k;
    //           matches.push(v);
    //         }
    //       });
    //       console.log(q, 'hovno');
    //
    //       cb(matches);
    //     }
    //   });
    //   console.log($('input.search-qql'));
    // },
    
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
