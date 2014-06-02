define(function (require) {
  var Qorus            = require('qorus/qorus'),
      Template         = require('text!templates/library/list.html'),
      TableTpl         = require('text!templates/library/table.html'),
      RowTpl           = require('text!templates/library/row.html'),
      Library          = require('collections/library'),
      LibraryDetailTpl = require('tpl!templates/library/detail.html'),
      View, DetailView;
      
  
  DetailView = Qorus.ModelView.extend({
    template: LibraryDetailTpl,
    off: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });
            
  View = Qorus.ListView.extend({
    additionalEvents: {
      "click [data-idattr]": "fetch"
    },
      
    template: Template,
    
    initialize: function (options) {
      View.__super__.initialize.call(this, options.collection, options.date, options);
      this.listenToOnce(this.collection, 'sync', this.render);
      // this.listenTo(this.collection, 'all', function () { console.log(arguments) });
    },
    
    preRender: function () {  
      _.each(this.collection.collections, function (col, name) {
        var view = this.setView(new Qorus.TableView({ className: "table table-stripped table-align-left", collection: col, row_template: RowTpl, template: TableTpl, name: name }), '#'+name).render();
        this.listenTo(view, 'row:clicked', this.fetch);
      }, this);
    },
    
    onRender: function () {
    },
    
    fetch: function (view) {
      var model = view.model;
      this.listenTo(model, 'sync', this.updateDetail);
      model.fetch();
    },

    updateDetail: function (model) {
      var view = this.setView(new DetailView({ model: model }), '#library-info', true);
      
      view.render();
    }
  });
  
  return View;
});
