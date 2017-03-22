define(function (require) {
  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone'),
      utils               = require('utils'),
      Qorus               = require('qorus/qorus'),
      settings            = require('settings'),
      Template            = require('text!templates/search/detail.html'),
      TableTpl            = require('text!templates/workflow/orders/table.html'),
      RowTpl              = require('text!templates/workflow/orders/row.html'),
//      InstanceListView  = require('views/workflows/instances'),
//      OrderListView     = require('views/workflows/orders'),
//      BottomBarView     = require('views/common/bottom_bar'),
      OrdersToolbar       = require('views/toolbars/search_toolbar'),
      OrderView           = require('views/workflows/order'),
      User                = require('models/system').User,
      Filters             = require('views/search/filters'),
      ModalView           = require('views/common/modal'),
      LockTemplate        = require('tpl!templates/workflow/orders/lock.html'),
      context, View, RowView, TableView, OrderLockView;

  context = {
    action_css: {
      'block': {
        'style': 'label-inverse',
        'icon': 'icon-minus-sign'
      },
      'unblock': {
        'style': '',
        'icon': 'icon-ok-sign'
      },
      'cancel': {
        'style': 'label-danger',
        'icon': 'icon-remove-sign'
      },
      'uncancel': {
        'style': 'label-warning',
        'icon': 'icon-remove-sign'
      },
      'retry': {
        'style': 'label-success',
        'icon': 'icon-refresh'
      },
      'reschedule': {
        'style': 'label-warning',
        'icon': 'icon-calendar'
      }
    }
  };

  OrderLockView = Qorus.ModelView.extend({
    template: LockTemplate,
    additionalEvents: {
      "submit": "lockOrder",
      "click button[type=submit]": "lockOrder"
    },

    lockOrder: function () {
      var note = this.$('textarea[name=note]').val();
      this.model.doAction(this.options.action, { note: note });
      this.trigger('close');
    }
  });

  RowView = Qorus.RowView.extend({
    context: {
      user: User
    },
    template: RowTpl,
    additionalEvents: {
      "click .order-lock": 'lockOrder',
      "click .order-unlock": 'unlockOrder',
      "click .order-breaklock": 'breakLockOrder',
      "click [data-action]": "runAction"
    },

    lockOrder: function (e) {
      this.applyLock('lock', e);
    },

    unlockOrder: function (e) {
      this.applyLock('unlock', e);
    },

    breakLockOrder: function (e) {
      this.applyLock('breakLock', e);
    },

    applyLock: function (action) {
      this.setView(new ModalView({
        content_view: new OrderLockView({ action: action, model: this.model})
      }), '.order-lock-modal');
    },

    runAction: function (e) {
      var data = e.currentTarget.dataset;
      if (data.action) {
        this.model.doAction(data.action);
        e.preventDefault();
      }
    },
  });

  TableView = Qorus.TableView.extend({
    fixed: true,
    postInit: function () {
      this.listenTo(this.collection, 'sync', this.update);

      if (this.collection.size() === 0) {
        this.template = "<p>Type instance ID or keyvalue to begin the search</p>";
      }
    }
  });

  View = Qorus.ListView.extend({
    context: context,
    url: function () {
     return '/search';
    },

    title: function () {
      var title = "Search";

      if (this.opts.search) {
        title += ": ";
        title += this.opts.search.ids;
      }

      return title;
    },

    additionalEvents: {
      // 'click #instances tbody tr': 'loadInfo',
      'submit .form-search': 'search',
      'submit .form-search-advanced': 'searchAdvanced',
      'click button[data-pagination]': 'nextPage',
      // 'keyup .search-query': 'search'
    },

    initialize: function (opts) {
      Qorus.ListView.__super__.initialize.apply(this, arguments);
      this.views = {};
      this.options = {};
      this.context =  {};
      this.opts = opts || {};
      this.opts.date = this.opts.date || settings.DATE_FROM;

      _.bindAll(this, 'render');

      this.template = Template;
      this.stopListening(this.collection);

      _.extend(this.options, this.opts);
      _.extend(this.context, this.opts);
      _.defer(this.render);
    },


    preRender: function () {
      var toolbar = this.setView(new OrdersToolbar({ search: this.opts.search }), '.toolbar');

      toolbar.stopListening(this.collection);

      this.createOrdersTable();
    },

    createOrdersTable: function () {
      this.setView(new TableView({
          collection: this.collection,
          template: TableTpl,
          row_template: RowTpl,
          row_view: RowView,
          helpers: this.helpers,
          context: { url: this.url },
          // fixed: true
      }), '#instances');
    },

    runAction: function (e) {
      e.stopPropagation();
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        var inst = this.collection.get(data.id);
        inst.doAction(data.action);
      }
    },

    nextPage: function () {
      this.collection.loadNextPage();
    },

    updateContext: function (render) {
      var view = this.getView('#instances');
      // update actual pages
      this.context.page = {
        current_page: this.collection.page,
        has_next: this.collection.hasNextPage()
      };

      if (view) view.render();
    },

    // fetches the collection from server presorted by key
    fetchSorted: function (e) {
      var el = e.currentTarget;
      // var sort = el.data('sort');
      // debug.log("Fetching sorted", sort);
      e.stopPropagation();
    },

    scroll: function (e) {
      var $target = $(e.currentTarget).find('#instances');
      var pos = this.$el.height() + $target.offset().top - $(window).height();
      debug.log(pos, $target.height(), $target.offset().top, $(window).height());
      // if (pos < 100) {
      //   this.nextPage();
      //   this.$el.children('button[data-pagination]').html("Loading...");
      // }
    },

    // opens the bottom bar with detail info about the Instance/Order
    loadInfo: function (e) {
      var self = this;
      var el = $(e.currentTarget);
      var bar = this.getView('#bottom-bar');

      if (el.hasClass('info')) {
        bar.hide();
        el.removeClass('info');
        this.removeView('#bottom-content');
      } else {
        e.stopPropagation();
        var oview = this.setView(new OrderView({ id: el.data('id') }), '#bottom-content');

        // this.subviews.order = oview;

        oview.listenTo(oview.model, 'change', function () {
          bar.render();
          oview.setElement(self.$('#bottom-content')).render();
          bar.show();

          // highlite/unhighlite selected row
          $('tr', el.parent()).removeClass('info');
          $('tr[data-id='+ el.data('id') +']').addClass('info');
        });
      }
    },

//    orderDetail: function (m) {
//      var tpl = _.template(OrderDetailTemplate, { item: m, workflow: this.model });
//      return tpl;
//    },

    // delegate search to current dataview
    search: function (e) {
      e.preventDefault();

      var data = {
        ids:      this.$('.search-query-ids').val().trim(),
        keyvalue: this.$('.search-query-keyvalues').val().trim()
      };

      this.applySearch(data);
    },

    helpers: {
      action_css: context.action_css
    },

    searchAdvanced: function (e) {
      e.preventDefault();
      var $target = $(e.currentTarget).find('input'),
          data    = Filters.process($target.val().trim());

      this.applySearch(data);
    },

    applySearch: function (data) {
      var table = this.getView('#instances');

      data = _.transform(data, function (res, v, k) { if (v || v === false) { res[k] = v; }});

      this.collection.reset();
      table.update(true);
      this.collection.fetch({ data: data });
      
      console.log(this.url(), utils.encodeQuery(data));

      Backbone.history.navigate([this.url(), utils.encodeQuery(data)].join("?"));
    }
  });
  return View;
});
