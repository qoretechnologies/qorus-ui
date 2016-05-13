define(function(require) {
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      settings    = require('settings'),
      utils       = require('utils'),
      Template    = require('tpl!templates/system/prop.html'),
      ConfirmView = require('views/common/confirm'),
      FilteredCollection = require('backbone.filtered.collection'),
      PropsCollection = require('collections/props'),
      // DomainTableTpl = require('tpl!templates/system/props/table.html'),
      // DomainRowTpl = require('tpl!templates/system/props/row.html'),
      PropsView;

  // DomainTable = Qorus.TableView.extend({
  //   tpl: DomainTableTpl,
  //   row_template: DomainRowTpl,
  //
  //   initialize: function (opts) {
  //     this.opts = opts || {};
  //     this.collection = new FilteredCollection(collection);
  //     this.collection.filterBy('domain', { domain: opts.domain });
  //   }
  // });

  PropsView = Qorus.View.extend({
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
      this.views = {};
      this.options = {};
      this.opts = opts || {};
      // this.query = this.getQueryFromUrl();
      this.context = {
        query: function () {
          return this.getQueryFromUrl();
        }.bind(this)
      };

      this.collection = new PropsCollection();

      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
      this.on('show', this.applySearch);
    },

    getUrl: function () {
      return [settings.REST_API_PREFIX, 'system', 'props'].join('/');
    },

    doAction: function (ev) {
      var params = {};
      var $target = $(ev.currentTarget);
      ev.preventDefault();

      if ($target.attr('type') == 'submit') {
        var $f = $target.parents('form');

        var vals = $f.serializeArray();

        _.each(vals, function (v) {
          params[v.name] = _.escape(v.value);
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
      this.updateUrl({ q: query });
      this.applySearch(query);
    },

    applySearch: _.debounce(function (query) {
      this.render();
    }, 300),

    updateUrl: function (params) {
      var url = utils.getCurrentLocationPath();
      var query = utils.parseQuery();
      params = params || {};
      query = _.extend({}, query, params);

      Backbone.history.navigate(url + '?' + utils.encodeQuery(query), { trigger: false });
    },

    getQueryFromUrl: function () {
      var query = utils.parseQuery();

      if (query.q) {
        return query.q;
      }
      return '';
    },

    preRender: function () {
      var q = this.getQueryFromUrl();
      var filtered = this.collection.toJSON();

      if (q !== '') {
        filtered = _.filter(filtered, function (m) {
          return m.domain.indexOf(q) !== -1;
        });
      }
      this.context.domains = _(filtered).pluck('domain').uniq().value();

      this.context.items = filtered;
      this.context.query = q;
    }
  });

  return PropsView;
});
