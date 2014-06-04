define(function (require) {
  var $                = require('jquery'),
      Qorus            = require('qorus/qorus'),
      Template         = require('text!templates/library/list.html'),
      TableTpl         = require('text!templates/library/table.html'),
      RowTpl           = require('text!templates/library/row.html'),
      Library          = require('collections/library'),
      LibraryDetailTpl = require('tpl!templates/library/detail.html'),
      Prism            = require('prism'),
      View, DetailView;
    
  DetailView = Qorus.ModelView.extend({
    template: LibraryDetailTpl,
    
    onRender: function () {
      this.highlight();
    },
    
    highlight: function () {
      var el = this.$el.find('code[class*="language-"]')[0];
      
      if (el) {
        Prism.highlightElement(el);
      }
    },
    
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
        var view = this.setView(new Qorus.TableView({ collection: col, row_template: RowTpl, template: TableTpl, name: name }), '#'+name).render();
        this.listenTo(view, 'row:clicked', this.fetch);
      }, this);
    },
    
    onRender: function () {
      this.fixHeights();
      $(window).on('resize.panes', $.proxy(this.fixHeights, this));
    },
    
    fixHeights: function () {
      console.log('r');
      var h = $(document).height() - $('header').height() - $('footer').height() - 6;
      this.$el.height(h).addClass('overflow');
      this.$el.find('.row-fluid > div').height(h);
    },
    
    fetch: function (view) {
      var model = view.model;
      
      if (!model.get('body')) {
        this.listenToOnce(model, 'sync', this.updateDetail);
        model.fetch();        
      } else {
        this.updateDetail(model);
      }
      this.$el.find('tr.info').removeClass('info');
      view.$el.addClass('info');
    },

    updateDetail: function (model) {
      var view = this.setView(new DetailView({ model: model }), '#library-info', true);
      
      view.render();
    },
    
    clean: function () {
      $(window).off('resize.panes');
    }
  });
  
  return View;
});
