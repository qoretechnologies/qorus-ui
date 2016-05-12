define(function(require) {
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      settings    = require('settings'),
      Template    = require('tpl!templates/system/prop.html'),
      ConfirmView = require('views/common/confirm'),
      FilteredCollection = require('backbone.filtered')
      ServiceView;

  ServiceView = Qorus.View.extend({
    views: {},
    defaultEvents: {
      'submit': 'doAction',
      'submit #property-search': 'search',
      'keyup #property-filter': 'search',
      'click a[data-action]': 'doAction',
      'click button[data-action]': 'doAction',
      'click a[data-action-confirm]': 'confirmAction'
    },
    template: Template,

    initialize: function (opts) {
      this.context = {};
      this.views = {};
      this.options = {};
      this.opts = opts || {};

      this.on('fetch', this.render);
      this.getData();
    },

    getUrl: function () {
      return [settings.REST_API_PREFIX, 'system', 'props'].join('/');
    },

    getData: function () {
      var self = this;
      var url = this.getUrl();

      $.get(url)
        .done(function (data) {
          self.data = data;
          self.context.data = data;
          self.trigger('fetch');
        });
    },

    // render: function (ctx) {
    //   this.context.data = this.data;
    //
    //   ServiceView.__super__.render.call(this, ctx);
    // },

    doAction: function (ev) {
      var params = {};
      var $target = $(ev.currentTarget);
      ev.preventDefault();

      if ($target.attr('type') == 'submit') {
        var $f = $target.parents('form');

        var vals = $f.serializeArray();

        _.each(vals, function (v) {
          params[v.name] = v.value;
        });

        // close modal
        $f.parents('.modal').modal('hide');
      } else {
        params = ev.currentTarget.dataset;
      }

      this.runAction($target.data('action'), params);
    },

    confirmAction: function (ev) {
      var $el   = $(ev.currentTarget),
          view  = this.setView(new ConfirmView({ element: $el, title: 'Delete property?' }), 'confirm'),
          self  = this;

      this.listenTo(view, 'confirm', function () {
        self.runAction($el.data('action-confirm'), $el.data());
      });
    },

    runAction: function (action, data) {
      var self = this;
      var url = [this.getUrl(), data.domain, data.key].join('/');

      if (action == 'update') {
        $.put(url, { action: 'set', parse_args: data.value })
          .done(function () {
            self.getData();
          })
          .fail(function (resp) {
            debug.log(resp);
          });
      } else if (action == 'delete') {
        $.delete(url)
          .done(function () {
            self.getData();
          })
          .fail(function (resp) {
            debug.log(resp);
          });
      }
    },

    search: function (e) {
      var query = this.$('#property-filter').val();
      this.applySearch(query);
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
    }
  });

  return ServiceView;
});
