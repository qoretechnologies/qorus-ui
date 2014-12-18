define(function(require) {
  var _                 = require('underscore'),
      settings          = require('settings'),
      Qorus             = require('qorus/qorus'),
      Filtered          = require("backbone.filtered.collection"),
      ErrorsTableTpl    = require('text!templates/workflow/errors/table.html'),
      ErrorsTpl         = require('tpl!templates/workflow/errors/list.html'),
      ErrorsRowTpl      = require('text!templates/workflow/errors/row.html'),
      ErrorsCollection  = require('collections/errors'),
      GlobalErrors      = require('collections/errors-global'),
      View, TableView;

  
  TableView = Qorus.TableView.extend({
    row_template: ErrorsRowTpl,
    template: ErrorsTableTpl,
    postInit: function () {
//      this.setView(new Toolbar(), '.toolbar');
    },
        search: function (e) {
      var $target = $(e.currentTarget),
          query   = $target.hasClass('search-query') ? $target.val() : $target.find('.search-query').val();
      
      this.applySearch(query);
      
      // prevent reload if submited by form
      if (e.type == "submit") {
        e.preventDefault();
      }
    },
    
    applySearch: function (query) {
      var $el = this.$el, url, url_query;
      
      if (!_.isString(query)) query = null;
      query = query || this.$('.search-query').val();
      
      if (!query || query.length < 1) {
        $el.find('tbody tr').show();
      } else {
        // console.log('searching for', query);
        $el.find('tbody tr').hide();
        _.each(query.split(settings.SEARCH_SEPARATOR), function (keyword) {
          this.$el.find("tbody td:icontains('" + keyword + "')").parent().show();
        }, this);
      }
    },
  });
  
  
  View = Qorus.View.extend({
    name: 'Error Defs',
    template: ErrorsTpl,
    postInit: function () {
      var col = new ErrorsCollection([], { workflowid: this.model.id });
      var glob = new Filtered(GlobalErrors);
      
      glob.listenTo(col, 'sync', function (collection) {
        var names = collection.pluck('error');
        this.filterBy('error', function (model) {
          return _.indexOf(names, model.get('error')) === -1;
        });
      });
      
      col.fetch();

      this.setView(new TableView({ 
        model: this.model, 
        collection: col, 
       }), '.workflow-errors-table');
      
      var globview = this.setView(new TableView({ 
        model: this.model, 
        collection: glob, 
        title: "Global definitions" 
      }), '.global-errors-table');
      
      globview.listenTo(glob, 'reset', function () {
        this.update();
      });
    }
  });
  
  return View;
});