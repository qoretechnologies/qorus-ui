define(function (require) {
  var $                = require('jquery'),
      _                = require('underscore'),
      Qorus            = require('qorus/qorus'),
      Template         = require('text!templates/library/list.html'),
      TableTpl         = require('text!templates/library/table.html'),
      RowTpl           = require('text!templates/library/row.html'),
      LibraryDetailTpl = require('tpl!templates/library/detail.html'),
      Prism            = require('prism'),
      ToolbarTpl       = require('tpl!templates/library/toolbar.html'),
      Toolbar          = require('views/toolbars/toolbar'),
      ToolbarView, View, DetailView, RowView;

  ToolbarView = Toolbar.extend({
    template: ToolbarTpl
  });

  DetailView = Qorus.ModelView.extend({
    template: LibraryDetailTpl,

    onRender: function () {
      var div = document.createElement('div'),
          code;

      if (this.model.get('body_highlighted')) {
        code = this.model.get('body_highlighted');
      } else {
        code = Prism.highlight(this.model.get('body'), Prism.languages.qore);
        this.model.set({ 'body_highlighted': code }, { silent: true });
      }

      div.innerHTML = code;

      this.$('code').append(div);
    },

    close: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });

  RowView = Qorus.RowView.extend({
    template: RowTpl,
    attributes: function () {
      return {
        "data-search": this.model.get('name').toLowerCase()
      };
    }
  });

  View = Qorus.ListView.extend({
    additionalEvents: {
      "click [data-idattr]": "fetch",
      "keyup input.filter": "search",
      "submit": "search"
    },

    template: Template,

    initialize: function (options) {
      View.__super__.initialize.call(this, options.collection, options.date, options);
      this.listenToOnce(this.collection, 'sync', this.render);
      // this.listenTo(this.collection, 'all', function () { console.log(arguments) });
    },

    preRender: function () {
      _.each(this.collection.collections, function (col, name) {
        var view = this.setView(new Qorus.TableView({ collection: col, row_view: RowView, row_template: RowTpl, template: TableTpl, name: name }), '#'+name).render();
        this.listenTo(view, 'row:clicked', this.fetch);
      }, this);
      this.setView(new ToolbarView(), '#toolbar');
    },

    onRender: function () {
      this.fixHeights();
      $(window).on('resize.panes', $.proxy(this.fixHeights, this));
    },

    fixHeights: function (e) {
      if (!e || !e.target.tagName) {
        var h = $(window).height() - this.$el.offset().top - $('footer').height() - 6;
        this.$el.height(h).addClass('overflow');
        this.$el.find('.row-fluid > div').height(h);
      }
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
    },

    search: function (e) {
      var query = this.$('input.filter').val();
      this.applySearch(query);
      $(window).trigger('resize.panes');
      e.preventDefault();
    },

    applySearch: function (query) {
      if (query.length < 1) {
        this.$('tr').show();
        return this;
      }

      this.$('tr').hide();
      this.$('tr[data-search*='+ query.toLowerCase() +']')
        .show()
        .parent()
        .prev('thead')
        .find('tr')
        .show();

      this.$('#library-info').height('');
    }
  });

  return View;
});
