define(function (require) {
  var _              = require('underscore'),
      $              = require('jquery'),
      Backbone       = require('backbone'),
      Qorus          = require('qorus/qorus'),
      Template       = require('text!templates/workflow/list.html'),
      Toolbar        = require('views/toolbars/workflows_toolbar'),
      Dispatcher     = require('qorus/dispatcher'),
      Modal          = require('views/workflows/modal'),
      TableTpl       = require('text!templates/workflow/table.html'),
      RowTpl         = require('text!templates/workflow/row.html'),
      WorkflowView   = require('views/workflows/detail'),
      PaneView       = require('views/common/pane'),
      utils          = require('utils'),
      qorus_helpers  = require('qorus/helpers'),
      helpers        = require('views/workflows/helpers'),
      AutostartView  = require('views/workflows/autostart'),
      Filtered       = require('backbone.filtered.collection'),
      Workflows      = require('collections/workflows'),
      getFilters     = require('views/workflows/utils').getFilters,
      ListView, RowView, TableView;

  // extending base RowView to add workflow related events
  RowView = Qorus.RowView.extend({
    helpers: helpers,
    __name__: 'WorkflowRowView',

    additionalEvents: {
      'click [data-action]': 'doAction'
    },

    className: function () {
      if (this.model.get('exec_count') > 0) {
        return 'table-row running';
      }

      return 'table-row';
    },

    initialize: function () {
      _.bindAll(this, 'render');
      RowView.__super__.initialize.apply(this, arguments);
      this.listenTo(this.model.collection, 'change:date', this.render);
    },

    onRender: function () {
      this
        .setView(new AutostartView({ model: this.model }), '.autostart', true)
        .render();
    },

    doAction: function (e) {
      var $target = $(e.currentTarget),
          action = $target.data('action');

      e.stopPropagation();
      e.preventDefault();
      this.model.doAction(action);
    },

    render: function () {
      if (this.is_rendered) return this;
      this.context.deprecated = this.model.collection.opts.deprecated;
      this.context.date = this.model.collection.opts.date;
      RowView.__super__.render.apply(this, arguments);
      this.is_rendered = true;
      return this;
    },

    hiJack: function (e) {
      e.preventDefault();
    }
  });

  TableView = Qorus.TableView.extend({
    __name__: 'WorkflowsTableView',
    initialize: function () {
      TableView.__super__.initialize.apply(this, arguments);
//      this.stopListening(this.collection);
//      this.listenToOnce(this.collection, 'sync', this.update);
//      this.stopListening(this.collection, 'add');
      this.processPath();
    },
    onProcessPath: function (path) {
      var id = path.split('/')[0];

      if (id) this.detail_id = id;
    },
    update: function () {
      TableView.__super__.update.apply(this, arguments);
    }
  });

  ListView = Qorus.ListView.extend({
    id: 'workflows',
    helpers: helpers,
    __name__: "WorkflowListView",
    url: function () {
      var url = qorus_helpers.getUrl('showWorkflows', {
        date: utils.encodeDate(this.opts.date),
        deprecated: getFilters(this.collection.opts).join(',')
      });
      return url;
    },

    timers: [],
    // el: $("#content"),
    additionalEvents: {
      'click .action-modal': 'openModal',
      'click a.running': 'highlightRunning',
      'click a.stopped': 'highlightStopped',
      'contextmenu .workflows tbody tr': 'onRightClick'
    },

    title: "Workflows",
    template: Template,

    initialize: function (collection, options) {
      _.bindAll(this, 'render');

      var filtered = new Filtered(collection);

      filtered.listenTo(collection, 'sync', function () {
        filtered.trigger('sync', filtered);
      });

      this.collection = filtered;
      this.collection.opts = filtered.superset().opts;

      this.options = {};
      this.context = {};
      this.opts = options || {};

      var col = collection;

      // call super method
      ListView.__super__.initialize.call(this, this.collection, options.date, options);

      // reassign listening events to collection
      this.stopListening(this.collection);

      this.listenToOnce(this.collection.superset(), 'sync', this.triggerRowClick);
      this.processPath(this.opts.path);
    },

    onProcessPath: function (path) {
      var id = path.split('/')[0];

      if (id) this.detail_id = id;
    },

    preRender: function () {

      // this.setView(new BottomBarView(), 'bottombar');
      var helpers = _.extend({ date: this.date }, this.helpers),
          collection = this.collection,
          tview, toolbar;

      collection.resetFilters();

      if (this.opts.running && this.opts.last) {
        collection.filterBy('running-last', function (m) {
          var last = _(collection.superset().models)
            .filter(function (i) { return i.get('name') === m.get('name'); })
            .sortBy(function (n) { return n.get('version'); })
            .last();

          return m.get('exec_count') > 0 || m.get('id') === last.get('id');
        });
      } else if (this.opts.running) {
        collection.filterBy('running', function (m) {
          return m.get('exec_count') > 0;
        });
      } else if (this.opts.last) {
        collection.filterBy('last', function (m) {
          var last = _(collection.superset().models)
            .filter(function (i) { return i.get('name') === m.get('name'); })
            .sortBy(function (n) { return n.get('version'); })
            .last();

          return m.id === last.id;
        });
      }

      // create workflows table
      tview = this.setView(new TableView({
          collection: collection,
          template: TableTpl,
          row_template: RowTpl,
          row_view: RowView,
          helpers: helpers,
          dispatcher: Dispatcher,
          deprecated: this.opts.deprecated,
          running: this.opts.running,
          last: this.opts.last,
          fixed: true
        }), '.workflows');

      // add listener to rowclick
      this.listenTo(tview, 'row:clicked', this.showDetail);
      this.listenTo(tview, 'update', this.applySearch);

      toolbar = this.setView(new Toolbar({
        date: this.date,
        parent: this,
        deprecated: this.opts.deprecated,
        collection: collection,
        running: this.opts.running,
        last: this.opts.last
      }), '.toolbar');
    },


    // edit action with Modal window form
    openModal: function (e) {
      var view;
      e.preventDefault();
      e.stopPropagation();

      var $target = $(e.currentTarget);

      if ($target.data) {
        view = this.setView(new Modal({ workflow: this.collection.get($target.data('id')) }), '#modal', true);
        view.render();
        view.open();
      }
    },

    // do batch action
    runBatchAction: function (action, method, params) {
      var ids = this.getCheckedIds(),
        $request;

      method = method || 'get';
      params = { action: action, ids: ids.join(',') };

      if (action == 'show' || action == 'hide') {
        params = { action: 'setDeprecated', ids: ids.join(','), deprecated: (action=='hide') };
      }

      if (method == 'get') {
        $request = $.get(this.collection.url, params);
      } else if (method == 'put') {
        $request = $.put(this.collection.url, params);
      } else if (method == 'dekete') {
        $request = $.put(this.collection.url, params);
      }

      $request
        .done(function (resp){
          debug.log(resp);
        });
    },

    loadNextPage: function () {
    },

    onRightClick: function (ev) {
      ev.preventDefault();

      var self = this;
      var $el = $(ev.currentTarget);
      var $menu = $('.context-menu', this.$el);
      var dataId = $el.data('id');


      this.$('a', $menu)
        .attr('data-id', dataId)
        .unbind('click')
        .click(function WFLMENUC(ev) {
          debug.log($(this).attr('class'));
          if ($(this).hasClass('action')) {
            self.runAction(ev);
          } else if ($(this).hasClass('action-modal')) {
            self.openModal(ev);
          }

          _.defer(function () {
            $menu.parent().removeClass('open');
          });
        });

      $menu.offset({ left: ev.pageX, top: ev.pageY });
      $menu.dropdown('toggle');
    },

    highlightRunning: function (e) {
      e.preventDefault();
      this.uncheckAll();

      var items = this.collection.filter(function (item) {
        return parseInt(item.get('exec_count'), 10) > 0;
      });

      if (items.length > 0) {
        _(items).each(function (item) {
          item.trigger('check');
        });
      }

    },

    highlightStopped: function (e) {
      e.preventDefault();

      this.uncheckAll();

      var items = this.collection.filter(function (item) {
        return parseInt(item.get('exec_count'), 10) === 0;
      });

      if (items.length > 0) {
        _(items).each(function (item) {
          item.trigger('check');
        });
      }
    },

    showDetail: function (row) {
      var view    = this.getView('#workflow-detail'),
          $detail = $('#workflow-detail'),
          id      = (view instanceof Backbone.View) ? view.$el.data('id') : null,
          left    = $('[data-sort="version"]').offset() && $('[data-sort="version"]').offset().left,
          width   = left ? $(document).width() - left : 400,
          model   = row.model,
          content_view, url;

      // set pane width
      $detail.width(width);

      if (id === model.id) {
        if (view) view.closeView();
        url = this.url();
        this.detail_id = null;
      } else {
        row.$el.addClass('info');

        content_view = new WorkflowView({
          model: model,
          context: _.clone(this.context)
        });

        // // add listener - for some reason it doesn't work inside ServiceView
        // this.listenTo(model, 'change', content_view.render);

        // init detail view
        view = this.setView(new PaneView({
            content_view: content_view,
            width: width
          }), '#workflow-detail', true);

        view.render();

        row.listenToOnce(view, 'off', function () {
          this.$el.removeClass('info');
        });

        url = this.getViewUrl() + row.model.id;

        view.upstreamUrl = this.getViewUrl();
        this.detail_id = row.model.id;
      }

      Backbone.history.navigate(url + Backbone.history.location.search);
    },

    enableActions: function () {
      var ids = this.getCheckedIds();

      debug.log(this.$el, $('.toolbar-actions', this.$el).attr('class'));

      if (ids.length > 0) {
        $('.toolbar-actions', this.$el).removeClass('hide');
        $('.toolbar-extra', this.$el).addClass('hide');
      } else {
        $('.toolbar-actions', this.$el).addClass('hide');
        $('.toolbar-extra', this.$el).removeClass('hide');
      }
    },

    clean: function () {
      this.collection.stopListening();
    }
  });

  return ListView;

});
