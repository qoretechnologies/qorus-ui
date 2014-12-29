define(function(require) {
  var _                 = require('underscore'),
      Backbone          = require('backbone'),
      settings          = require('settings'),
      Qorus             = require('qorus/qorus'),
      Filtered          = require("backbone.filtered.collection"),
      ErrorsTableTpl    = require('text!templates/workflow/errors/table.html'),
      ErrorsTpl         = require('tpl!templates/workflow/errors/list.html'),
      ErrorsRowTpl      = require('text!templates/workflow/errors/row.html'),
      ErrorsCollection  = require('collections/errors'),
      GlobalErrors      = require('collections/errors-global'),
      Forms             = require('views/workflows/errors/forms'),
      Modal             = require('views/common/modal'),
      ModalView         = require('views/common/modal'),
      ModalTpl          = require('tpl!templates/workflow/errors/modal.html'),
      PaneView          = require('views/common/pane'),
      View, TableView, RowView, DetailView;
  

  Modal = ModalView.extend({ 
    template: ModalTpl,
    additionalEvents: {
      "submit": 'delegateSubmit',
      "click button[type=submit]": 'delegateSubmit'
    },
    delegateSubmit: function (e) {
      this.$('form').trigger('submit', e);
    }
  });
  
  RowView = Qorus.RowView.extend({
    additionalEvents: {
      "click [data-action]": 'doAction'
    },
    postInit: function () {
      this.listenTo(this.model, 'change', this.render);
    },
    doAction: function (e) {
      var $target = $(e.currentTarget),
          opts    = $target.data();
      
      if (opts.action == 'edit') {
        this.trigger('edit', this.model);
        this.parent.trigger('row:edit', this.model);
      } else if (opts.action == 'clone') {
        this.trigger('clone', this.model);
        this.parent.trigger('row:clone', this.model);
      } else {
        this.model.doAction(opts);
      }
    }
  });

  
  TableView = Qorus.TableView.extend({
    additionalEvents: {
      "keyp .search-query": "search",
      "submit": "search",
    },
    row_view: RowView,
    row_template: ErrorsRowTpl,
    template: ErrorsTableTpl,
    
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
    name: 'Errors',
    template: ErrorsTpl,
    postInit: function () {
      var TView, globview,
          col   = new ErrorsCollection([], { workflowid: this.model.id }),
          glob  = new Filtered(GlobalErrors);
      
      glob.listenTo(col, 'sync add destroy', function (model, collection) {
        var names;
        
        if (model instanceof Backbone.Collection) {
          collection = model;
        }
        
        if (collection instanceof Backbone.Model) {
          names = [collection.get('error')];
        } else {
          names = collection.pluck('error');
        }
        
        this.filterBy('error', function (model) {
          return _.indexOf(names, model.get('error')) === -1;
        });
      });
      
      col.fetch();
      this.collection = col;

      TView = this.setView(new TableView({ 
        model: this.model, 
        collection: col, 
       }), '.workflow-errors-table');

      this.listenTo(TView, 'row:edit', this.showEditView);
      
      globview = this.setView(new TableView({ 
        model: this.model, 
        collection: glob, 
        title: "Global definitions" 
      }), '.global-errors-table');
      
      this.listenTo(globview, 'row:clone', this.showCloneView);
      
      globview.listenTo(glob, 'reset', function () {
        this.update();
      });
    },
    
    showCloneView: function (model) {
      var clone = model.clone();
      clone.set({ 
          workflowid: this.model.get('workflowid'), 
          type: 'workflow' 
        }, 
        { silent: true }
      );
      this.showEditView(clone);
    },
    
    showEditView: function (model) {
      var form = new Forms.Error({
          model: model,
          collection: this.collection
      });
      
      var wrap = new Qorus.View();
      wrap.insertView(form, 'self');
      
      var modal = this.setView(new Modal({
        content_view: wrap,
        edit: true
      }));
      modal.context.edit = true;
      
      modal.listenTo(form, 'close', modal.hide);
    }
  });
  
  return View;
});