// Qorus core objects definitions
define(function (require) {
  var $               = require('jquery'),
      _               = require('underscore'),
      Backbone        = require('backbone'),
      // Keys         = require('backbone.keys'),
      settings        = require('settings'),
      utils           = require('utils'),
      // Dispatcher   = require('qorus/dispatcher'),
      TableTpl        = require('tpl!templates/common/table.html'),
      TableRowTpl     = require('tpl!templates/common/tablerow.html'),
      NoDataTpl       = require('tpl!templates/common/nodata.html'),
      LoadingDataTpl  = require('tpl!templates/common/loadingdata.html'),
      Helpers         = require('qorus/helpers'),
      moment          = require('moment'),
      // Filtered    = require('backbone.filtered.collection'),
      LoaderView, View, ListView, TableView, RowView, 
      TableAutoView, ServiceView, PluginView, CollectionView,
      TabView, ModelView, THeadView, TBodyView, TFootView, TRowView;

  require('bootstrap');

  $.extend($.expr[':'], {
    'icontains': function (elem, i, match) //, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
  
  View = Backbone.View.extend({
    is_rendered: false,
    render_lock: false,
    __name__: 'View',
    upstreamUrl: "",
    url: '',
    defaultEvents: {
      "submit": "doNothing",
      "dblclick .selectable": "selectName"
      // "click a[href^='/']": 'catchAClick'
    },
    model_name: null,
    // opts: {},
    path: "",
    _is_rendered: false,
    
    // merging defaultEvents with additionalEvents
    events : function () {
      var aEvents = this.additionalEvents || {};
      return _.extend({}, this.defaultEvents, aEvents);
    },
    context: {},
    
    
    initialize: function (options) {
      this.preInit();
      _.bindAll(this, 'render', 'insertView', 'setView', 'off');
      this.context = {};
      this.views = {};
      this.options = {};
      this.opts = {};
      this.helpers = this.helpers || {};
      
      // set DATE format and init date
      this.date_format = settings.DATE_DISPLAY;

      if (_.isObject(options)) {
        if (options.date === undefined || options.date === null) {
          options.date = moment().add('days', -1).format(this.date_format);
        } else if (options.date == 'all') {
          options.date = moment(settings.DATE_FROM).format(this.date_format);
        }        
      }
      
      View.__super__.initialize.call(this, [options]);
      
      _.extend(this.context, options);
      _.extend(this.options, options);
      
      if (_.has(this.options, 'template')) this.template = this.options.template;
      this.processPath();
      
      if (this.collection || this.model) {
        if (this.collection instanceof Backbone.Collection) {
          this.listenTo(this.collection, 'sync:error', this.onSyncError);
        } else if (this.model instanceof Backbone.Model) {
          this.listenTo(this.model, 'sync:error', this.onSyncError);
        }
      }
      this.initLoader();
      this.postInit();
    },
        
    close: function (remove) {
      this.removeViews();
      
      if (_.isFunction(this.clean)) {
        this.clean();
      }
      
      this.trigger('destroy', this);
      View.__super__.off.call(this);
      this.undelegateEvents();

      if (remove !== false) {
        this.remove();
      }
      this.views = {};
      return this;
    },
    
    render: function (ctx) {
      // var start = new Date().getTime(), tpl;
      var tpl;
      
      if (this.render_lock) return;
      // this.clean();
      // this.removeViews();

      this.trigger('prerender', this);
      this.preRender();

      if (this.template) {
        if (ctx && !(ctx instanceof Backbone.Model)) {
          _.extend(this.context, ctx); 
        }
        
        // adding template helpers
        _.extend(this.context, Helpers, this.helpers);

        if (_.isFunction(this.template)) {
          tpl = this.template(this.context);
        } else {
          tpl = _.template(this.template, this.context);
        }
        
        this.$el.html(tpl);
        
        this.trigger('render', this, {});
      }


      this.renderViews();
      this.setTitle();
      this.onRender();
      this.trigger('postrender', this);
      
      if (_.isFunction(this.processUrlParams))
        this.processUrlParams();
      
      this._is_rendered = true;
      
      return this;
    },
    
    // removes view by ID
    removeView: function (id) {
      var view = this.getView(id);
      
      if (view instanceof Backbone.View) {
        // console.log(id, 'is backbone view removing');
        view.close();
      } else if (_.isArray(view)) {
        // console.log(id, 'is array');
        _.each(view, function (v) {
          v.close();
        });
      }
      if (view) delete this.views[id];
      
      return this;
    },
    
    // removes all subviews
    removeViews: function () {
      _.each(_.result(this, 'views'), function (view) {
        debug.log('removing subviews');
        if (_.isArray(view)) {
          _.each(view, function (v) {
            // debug.log('removing view from array', v.cid);
            v.close();
          });
        } else if (view instanceof Backbone.View) {
          // debug.log('removing view', view.cid);
          view.close();
        }
      });
      this.views = {};
      return this;
    },
    
    // returns view by specified id, el id attr in the most cases
    getView: function (id) {
      var views = _.result(this, 'views');
      if (id in views)
        return views[id];

      return null;
    },
    
    // renders specific subview
    renderView: function (id, view) {
      if (!view) {
        view = this.getView(id);
      }
      
      if (view instanceof Backbone.View) {
        view.setElement(this.$(id)).render();
      } else if (_.isArray(view)) {
        var $el = this.$(id),
            el  = $el.get(0);
        
        if (el) {
          while(el.firstChild)
            el.removeChild(el.firstChild);            
        }
          
        var frag = document.createDocumentFragment();

        _.each(view, function (v) {
          if (v.el) frag.appendChild(v.render().el);
        });
        
        if (id === 'self') $el = this.$el;
        $(frag).appendTo($el);
      }
    },
    
    // renders subviews
    renderViews: function () {
      _.each(_.result(this,'views'), function (view, id) {
        if (id!=='tabs')  this.renderView(id, view);
      }, this);
      return this;
    },
    
    // executes before rendering
    preRender: function () {
    },
    
    // executes after rendering
    onRender: function () {
    },
    
    // adds view into el views array
    // useful for table rows
    insertView: function (view, el, append) {
      var views, old_view,
          views_list = _.result(this, 'views');

      this._updateViewUrl(view);
      
      if (views_list[el]) {
        views = views_list[el];
      } else {
        views = views_list[el] = [];
      }
      
      el = el || '';
      
      if (views instanceof Backbone.View) {
        old_view = views;
        views = [old_view];
      }
        
      view.view_idx = views.push(view) - 1;
      
      if (append === true) {
        var $el = (el === 'self') ? this.$el : this.$(el);
        $el.append(view.render().$el);
      }
      
      return view;
    },
    
    // adds subview to el
    setView: function (view, el, set) {
      this.removeView(el);
      this.views[el] = view;

      this._updateViewUrl(view);

      // debug.log('setting view', view, el, set);
      if (set === true) {
        // console.log('setting element on view', el, this.$(el));
        view.setElement(this.$(el));  
        // view.setElement(this.$(el)).render();
      }
      
      return view;
    },
    
    _updateViewUrl: function (view) {
      if (view instanceof Backbone.View && view.processPath) {
        view.processPath(this.processPath(null, true));
        view.upstreamUrl = this.getViewUrl();
      }
    },
    
    // sets document title if defined in view
    setTitle: function () {
      var title, inst;
      
      if (this.title) {
        title = _.result(this, 'title');
        inst = document.title.match(/(.*)\| /g);
        if (inst) {
          document.title = inst[0];
        } else {
          document.title = "";
        }

        document.title += " " + title; 
      }
      return this;
    },
    
    clean: function () {
      // debug.log('called stop listening on', this.cid);
      // this.stopListening();
      return this;
    },
    
    updateModels: function () {
      // if (e.info) {
      //   var m = this.collection.get(e.info.id);
      //   debug.log('Updating model', m);
      //   m.fetch();
      // }
    },
    
    doNothing: function (e) {
      debug.log('Do nothing', e);
      e.preventDefault();
      e.stopPropagation();
      return this;
    },
    
    lock: function () {
      // console.log(this.cid, 'locked');
      this.render_lock = true;
      return this;
    },
    
    unlock: function () {
      // console.log(this.cid, 'unlocked');
      this.render_lock = false;
      return this;
    },
    
    getUrlParams: function () {
      return utils.parseURLparams();
    },
    
    processUrlParams: function () {
    },
    
    // process url and executes associated event/method
    // returns path tail
    processPath: function (path, silent) {
      var action, tail;

      path = path || this.path;
      
      if (!path) return;
      
      this.path = path;
      
      path = path.split('/');
      
      if (path.length === 0) return;

      action = path.shift();
      tail = path.join('/');
      
      // dont execute associated events/methods if in silent mode
      if (silent !== true) {
        this.trigger('processpath', action, tail, this);
        if (this.onProcessPath) this.onProcessPath(action, tail, this);
      }
      
      return tail;
    },
    
    getViewUrl: function () {
      return this.upstreamUrl + _.result(this, 'url');
    },
    
    selectName: function (e) {
      var $target = $(e.currentTarget);
      var range, selection;
    
      if (window.getSelection && document.createRange) {
          selection = window.getSelection();
          range = document.createRange();
          range.selectNodeContents($target[0]);
          selection.removeAllRanges();
          selection.addRange(range);
      } else if (document.selection && document.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText($target[0]);
          range.select();
      }
    },
    
    slug: function () {
      if (this.name) return Helpers.slugify(this.name);
      return Helpers.slugify(this.__name__);
    },
    
    onSyncError: function () {},
    
    id: function () {
      var name = this.name || this.__name__;
      name = this.cid + '_' + name;
      return Helpers.slugify(name);
    },
    
    preInit: function () {},
    postInit: function () {},
    initLoader: function () {
      if (this.loader) {
        var loader = this.setView(new this.loader(), '_loader');
        this.$el.html(loader.render().$el.html());
        this.once('prerender', this.removeLoader);
      }
    },
    removeLoader: function () {
      this.removeView('_loader');
    }
   });

   ListView = View.extend({
     __name__: 'ListView',
     className: 'listview',
     context: {},
     opts: {},
     keys: {
       'up down': 'navigate'
     },
     
    defaultEvents: {
      'click .check': 'highlight',
      'click .check-all': 'checkall',
      'click .uncheck-all': 'checkall',
      'click .invert': 'invert',
      'submit .form-search': 'search',
      'keyup .search-query': 'search',
      "click button[data-option]": "setOption",
      "click button[data-action]": "runAction",
      "click button[data-action='execute']": "openExecuteModal",
      "click a[data-action]": "runAction",
      "click a[data-back]": "historyBack",
      "dblclick .selectable": "selectName"
      // "show": function (e) { console.log('shown', arguments )}
    },
    
    events : function () {
      return _.extend({}, this.defaultEvents, this.additionalEvents);
    },
    
    // TODO: change positional arguments to single hash argument { collection: collection, date: date, more: options }
    initialize: function (collection, date, options) {
      _.bindAll(this, 'render');
      ListView.__super__.initialize.call(this, options);
      // add element loader
      // this.loader = new Loader({ el: $('#wrap') });
      // this.loader.render();
      this.opts = options || {};

      // set DATE format and init date
      this.date_format = settings.DATE_DISPLAY;
      if (date === undefined || date === null || date === '24h') {
        this.date = moment().add('days', -1).format(this.date_format);
      } else if (date == 'all') {
        this.date = moment(settings.DATE_FROM).format(this.date_format);
      } else if (date.match(/^[0-9]+$/)) {
        this.date = moment(date, 'YYYYMMDDHHmmss').format(this.date_format);
      } else {
        this.date = date;
      }
      
      this.opts.date = this.date;
      
      // TODO: improve code for collection checking
      if (!collection || !_.isFunction(collection)) collection = this.collection;
      
      if (collection) {
        if (collection instanceof Backbone.Collection) {
          this.collection = collection;
        } else {
          this.collection = new collection([], this.opts);
        }
        
        if (this.opts.fetch !== false)
          this.collection.fetch();
      
        this.context.page = {
          current_page: this.collection.page,
          has_next: this.collection.hasNextPage,
          has_prev: null
        };
        
        _.extend(this.context, this.opts);
        
        // this.loader = new Loader();
        // this.listenToOnce(this.collection, 'sync error', this.loader.remove);
      }
      
      
      this.on('highlight highlight:none', this.enableActions);
      this.on('highlight highlight:none', this.updateCheckIcon);
      this.on('highlight:none', this.uncheckAll);
      this.listenTo(this.collection, 'sync', this.triggerRowClick);
      this.render();
    },

    render: function (ctx) {
      var tpl;
            
      this.removeViews();
      this.trigger('prerender');
      this.preRender();
      // debug.log('Starts rendering with context ->', this.context.page.has_next);
      
      if (this.template) {
        ctx = {
          date: this.date,
          items: this.collection.models
        };

        // adding template helpers
        _.extend(this.context, ctx, Helpers, this.helpers);
        
        if (_.isFunction(this.template)) {
          tpl = this.template(this.context);
        } else {
          tpl = _.template(this.template, this.context);
        }
        this.$el.html(tpl);
        
        if (this.loader)
          this.loader.destroy();
        this.trigger('render', this, {});
      }
    
      if (_.isFunction(this.afterRender)) {
        // Run afterRender when attached to DOM
        _.defer(this.afterRender);
      }
      this.renderViews();
      this.setTitle();
      this.onRender();
      debug.log('Finished rendering', this);
      
      if (_.isFunction(this.processUrlParams))
        this.processUrlParams();
      
      this.trigger('postrender', this);
      return this;
    },
    
    historyBack: function (e) {
      e.preventDefault();
      debug.log("back button", e);
      window.history.back();
    },
    
    // toggle select row
    highlight: function (e) {
      var $el = $(e.currentTarget);
      
      $el
        .toggleClass('icon-check-empty')
        .toggleClass('icon-check');

      $el
        .parents('.table-row')
        .toggleClass('warning')
        .toggleClass('checked');
      
      this.updateCheckIcon();
        
      e.stopPropagation();
      this.trigger('highlight');
      this.trigger('highlight:toggle');
    },

    // start batch actions definition

    // toggle select on all rows
    checkall: function (e) {
      var $el = $(e.currentTarget);

      // behaviour switcher
      if ($el.hasClass('check-all')) {
        $('.table-row')
          .addClass('warning')
          .addClass('checked');

        $('.table-row .check')
          .removeClass('icon-check-empty')
          .addClass('icon-check');
        this.trigger('highlight:all');
      } else {
        this.uncheckAll();
        this.trigger('highlight:none');
      }

      if (e.target.localName == "i") {
        e.stopPropagation();        
      }

      this.trigger('highlight');
    },
    
    uncheckAll: function () {
      this.$('.table-row')
        .removeClass('warning')
        .removeClass('checked');

      this.$('.table-row .check')
        .removeClass('icon-check')
        .addClass('icon-check-empty');
      
      this.enableActions();
      this.updateCheckIcon();
    },
    
    checkRow: function (id) {
      var model = this.collection.get(id);
      
      if (model) {
        model.trigger('check');
      }
      this.trigger('highlight:row');
    },
    
    updateCheckIcon: function () {
      var $checker = this.$('i.checker');
      var total = this.$('tbody tr').size();
      var selected = this.getCheckedIds().length;

      if (selected === 0) {
        $checker
          .removeClass('icon-check')
          .removeClass('icon-check-minus')
          .removeClass('uncheck-all')
          .addClass('icon-check-empty')
          .addClass('check-all');
      } else if (selected == total) {
        $checker
          .removeClass('icon-check-minus')
          .removeClass('icon-check-empty')
          .removeClass('check-all')
          .addClass('icon-check')
          .addClass('uncheck-all');
      } else {
        $checker
          .removeClass('icon-check')
          .removeClass('icon-check-empty')
          .removeClass('uncheck-all')
          .addClass('icon-check-minus')
          .addClass('check-all');
      }
      
    },
    
    invert: function () {
      $('.table-row .check', this.$el)
        .toggleClass('icon-check')
        .toggleClass('icon-check-empty');
      
      $('.table-row')
        .toggleClass('warning')
        .toggleClass('checked');

      this.trigger('highlight');
      this.trigger('highlight:invert');
    },
    
    // get all visible checked rows and its data-id attribute
    getCheckedIds: function () {
      var $checked_rows = $('.icon-check').parents('tr:visible');
      var ids = [];
      
      _.each($checked_rows, function (row) {
        ids.push($(row).data('id'));
      });

      return ids;
    },
    
    // do batch action
    runBatchAction: function (action, method, params) {
      var ids = this.getCheckedIds(),
        $request;
      method = method || 'get';
      params = { action: action, ids: ids.join(',') };
      
      if (method == 'get') {
        $request = $.get(this.collection.url, params);
      } else if (method == 'put') {
        $request = $.put(this.collection.url, params);
      } else if (method == 'delete') {
        $request = $.put(this.collection.url, params);
      }
      
      $request
        .done(function (resp){
          debug.log(resp);
        });
    },
    
    enableActions: function () {
      var ids = this.getCheckedIds();
      
      debug.log(this.$el, $('.toolbar-actions', this.$el).attr('class'));
      
      if (ids.length > 0) {
        $('.toolbar-actions', this.$el).removeClass('hide');
      } else {
        $('.toolbar-actions', this.$el).addClass('hide');
      }
    },
    
    // end batch section definition
    
    runAction: function (e) {
      var $target = $(e.currentTarget);
      var data = e.currentTarget.dataset;
      
      if (data.action && data.action != 'open' && data.action !== 'execute') {
        if (data.id == 'selected') {
          this.runBatchAction(data.action, data.method, _.omit(data, 'action', 'method', 'id'));
        } else if (data.id) {
          if (!$target.hasClass('action-modal')) {
            debug.log("data action", data.id, data.action);
            // $target.text(data.msg.toUpperCase());
            var inst = this.collection.get(data.id);
            inst.doAction(data.action, data);            
          }
        }
      } else if (data.action == 'open') {
        this.openURL($target.data('url') || $target.attr('href'));
      }
      e.preventDefault();
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
      
      url_query = utils.parseQuery(Backbone.history.fragment);
      url_query.q = query;
      url = [Backbone.history.location.pathname, utils.encodeQuery(url_query)].join('?');
      
      if (query)
        Backbone.history.navigate(url);
    },
    
    openURL: function (url) {
      Backbone.history.navigate(url, { trigger: true });
    },
    
    nextPage: function () {
      this.collection.loadNextPage();
    },    
    
    navigate: function (e) { 
      var $el, $next, h;
      
      if (this.$el.is(':visible') && this.$('.info')) {
        $el = this.$('.info');
        
        if (e.keyCode === 38) {
          $next = $el.prev();
        } else {
          $next = $el.next();
        }
        
        if ($next.length > 0) {
          $el.removeClass('info');
          $next.addClass('info').click();
          
          if ($('body').scrollTop() + $(window).height() < $next.offset().top + $next.height()) {
            h = $next.offset().top - $(window).height() + $next.height();
            $('body').scrollTop(h);
          }

          e.preventDefault();
        }
      }
    },
    
    processUrlParams: function () {
      var params = this.getUrlParams(),
          self   = this;

      _(params).each(function (param) {
        var event = param.shift();
        self.trigger(event, param, self);
      });
    },
    
    triggerRowClick: function () {
      if (this.detail_id) {
        var m = this.collection.get(this.detail_id);
        if (m) m.trigger('rowClick');
      }
    }
  });

  TableView = View.extend({
    __name__: 'TableView',
    tagName: 'table',
    messages: {
      'loading': 'Loading...',
      'nodata': "No data found"
    },
    cached_views: {},
    fixed: false,
    additionalEvents: {
      'click th': 'sortView'
    },
    template: TableTpl,
    row_template: undefined,
    dispatcher: undefined,
    
    initialize: function (opts) {
      this.preInit();
      _.bindAll(this);
      this.context = {};
      this.views = {};
      this.options = {};
      
      this.RowView = this.row_view || RowView;
      this.opts = opts || {};
      
      debug.log('table view collection', this.collection);
      this.collection = opts.collection;

      this.listenTo(this.collection, 'add', this.append);
      // this.listenTo(this.collection, 'resort', this.update);
      if (this.collection.size() === 0)
        this.listenToOnce(this.collection, 'sync', this.update);

      this.listenTo(this.collection, 'sync:error', this.onSyncError);
      
      if (_.has(opts, 'parent')) this.parent = opts.parent;
      if (_.has(opts, 'template')) this.template = _.template(opts.template);
      if (_.has(opts, 'row_template')) this.row_template = opts.row_template;
      if (_.has(opts, 'row_view')) this.RowView = opts.row_view;
      if (_.has(opts, 'row_attributes')) this.row_attributes = opts.row_attributes;
      if (_.has(opts, 'helpers')) this.helpers = opts.helpers;
      if (_.has(opts, 'dispatcher')) this.dispatcher = opts.dispatcher;
      if (_.has(opts, 'fixed')) this.fixed = opts.fixed;
      if (_.has(opts, 'messages')) _.extend(this.messages, opts.messages);
      
      // pre-compile row template
      this.row_tpl = _.template(this.row_template);
      
      this.opts.template = this.template;
      
      _.extend(this.context, opts);
      _.extend(this.options, opts);
      
      this.update(true);
      this.postInit();
    },
    
    render: function (ctx) {
      this.context.messages = this.messages;

      TableView.__super__.render.call(this, ctx);
      return this;
    },
       
    onRender: function () {
      $(window).on('resize.table.'+this.cid, this.resize);
      
      // if (this.collection.pagination) 
      //   this.$el.closest('.pane').on('scroll', this.scroll);
      
      // load next button
      if (this.collection.hasNextPage) {
        if (this.collection.hasNextPage()) {
          this.$el.append($('<button class="btn btn-primary" data-pagination="loadNextPage">Load Next... </button>'));
        }        
      }
      this.sortIcon();
    },
    
    setWidths: function () {
      if (!this.fixed) return;
      var clgrp = $('<colgroup />');

      this.$('colgroup').remove();

      this.$('tr').first().children().each(function () {
        clgrp.append($('<col />').width($(this).outerWidth()));
      });
      this.$('.table-fixed').prepend(clgrp);
    },
    
    resize: _.debounce(function (e) {
        if (!e || !e.target.tagName) {
          // fix static header width and pos
          if (this.fixed === true) {
            this.$('.table-fixed').fixedHeader();
          }
          this.setWidths();
        }
      }, 200, { trailing: true, leading: true, maxWait: 5*200 }
    ),
    
    clean: function () {
      this.$('.table-fixed').fixedHeader('remove');
      $(window).off('resize.table.'+this.cid);
      // this.$el.closest('.pane').close('scroll');
    },
    
    scroll: function () {
      // if not visible do nothing
      if (!this.$el.is(':visible')) return;

      var pos = this.$el.height() + this.$el.offset().top - $(window).height();
  
      if (pos < 100) {
        this.collection.loadNextPage(); 
        this.$('button[data-pagination]').html("Loading...");
      }
    },

    append: function (model) {
      this.appendRow(model);
    },

    emptyRows: function () {
      // this.getView('tbody').close();
      this.update();
    },

    appendRows: function (models) {
      if ('tbody' in this.views) {
        this.removeView('tbody');
      }

      this.$('tbody').html('<tr><td colspan=100><i class="icon-spin icon-refresh"></i>Loading</td></tr>');

//      console.time('appending');
      var frag = document.createDocumentFragment();

      _.each(models, function (m, i) {
        var view = this.appendRow(m, false);
        frag.appendChild(view.el);
      }, this);

//      console.timeEnd('appending');
      this.$('tbody').empty().append(frag);
      _.defer(this.resize);
      this.trigger('rows:appended', this);
    },

    appendRow: function (m, render) {
      if (this.template === NoDataTpl) this.render();
      
      var view = this.insertView(new this.RowView({
            model: m, 
            template: this.row_tpl, 
            helpers: this.helpers, 
            parent: this,
            row_attributes: this.row_attributes 
          }), 'tbody'),
          idx;
      
      render = (render===undefined) ? true : render;
      
      if (render === true) {
        idx = this.collection.indexOf(m-1);
        if (this.$('tbody tr').get(idx)) {
          $(this.$('tbody tr').get(idx)).after(view.render().$el);
        } else {
          this.$('tbody').append(view.render().$el);
        }
      }

      return view;
    },
        
    update: function (initial) {
      var tpl = this.template, tt;
      
      if (this.collection.size() === 0 && initial === undefined) {
        this.template = NoDataTpl;
      } else if (this.collection.size() > 0) {
        this.template = this.opts.template;
      } else {
        this.template = LoadingDataTpl;
      }
      

      if (this.template !== tpl) {
        this.render();
      }
      
      if (this.collection.size() > 0)
        this.appendRows(this.collection.models);
    
      this.trigger('update');
    },
    
    // sort view
    sortView: function (e) {
      debug.log("Sort by ", e);
      var el = $(e.currentTarget);
      if (el.data('sort')) {
        // this.collection.sortByKey(el.data('sort'), el.data('order'));
        var key = el.data('sort'),
          order = el.data('order'),
          prev_key = this.collection.sort_key,
          views = this.getView('tbody');
        
        this.collection.sort_order = order;
        this.collection.sort_key = key;
        if (this.collection.sort_history) this.collection.sort_history.push(prev_key);

        views = views.sort(function (c1, c2) {
          // needs speed improvements
          var k10 = utils.prep(c1.model.get(key)),
              k20 = utils.prep(c2.model.get(key)),
              r   = 1,
              k11, k21;
          
          if (order === 'des') r = -1;
          
          if (k10 < k20) return -1 * r;
          if (k10 > k20) return 1 * r;
          
          k11 = utils.prep(c1.model.get(prev_key));
          k21 = utils.prep(c2.model.get(prev_key));
          
          if (k11 > k21) return -1 * r;
          if (k11 < k21) return 1 * r;
          return 0;
        });
        

        // cleaning the view the dirty way
        var tbody = this.$('tbody').get(0);

        while (tbody.firstChild)
          tbody.removeChild(tbody.firstChild);
        delete this.views.tbody;
        
        // resetting the element
        this.setView(views, 'tbody');
        this.renderView('tbody');
        this.sortIcon();
      }
      this.trigger('sort');
    },
    
    sortIcon: function () {
      var key   = this.collection.sort_key,
          order = this.collection.sort_order,
          $el   = this.$('[data-sort="'+ key +'"]');
      
      this.$('.sort')
        .removeClass('sort-asc')
        .removeClass('sort-des')
        .removeClass('sort');
      
      $el.addClass('sort');
      
      if (order == 'des') {
        $el.data('order', 'asc');
        $el.addClass('sort-asc');
      } else {
        $el.data('order', 'des');
        $el.addClass('sort-des');
      }
    },
    
    onSyncError: function (collection, response, options) {
      this.template = _.template('<div class="alert alert-warning"><h4><%= response.err %></h4><p><%= response.desc %></p></div>', 
                        { response: response.responseJSON, options: options });
      this.render();
    }
  });
  
  TableAutoView = TableView.extend({
    columns: []
  });
  
  TBodyView = View.extend({
    tagName: 'tbody',
    context: {}
  });
  
  THeadView = View.extend({
    tagName: 'thead',
    context: {}
  });
  
  TFootView = View.extend({
    tagName: 'tfoot',
    context: {}
  });
  
  TRowView = View.extend({
    tagName: 'tr'
  });

  RowView = View.extend({
    __name__: 'RowView',
    tagName: 'tr',
    className: 'table-row',
    clickable: true,
    context: {},
    render_count: 0,
    template: TableRowTpl,
    // timeout_buffer: 0,
    // timeout_buffer_max: 200,
    // timeout: null,
    // timer: 0,
    // timer_max: 10,
    click: 0,
    
    attributes: function() {
      var data = { 'data-id': this.model.id },
        self = this;
      
      if (this.row_attributes) {
        _.each(this.row_attributes, function (atr) {
          var key = 'data-' + atr;
          data[key] = self.model.get(atr);
        });
      }
      
      if (this.clickable) 
        data.class = this.className + ' clickable';
        
      return data;
    },
    
    defaultEvents: {
      'click': 'rowClick',
      'shown.bs.dropdown .btn-group': 'lock',
      'hidden.bs.dropdown .btn-group': 'unlock',
      "dblclick .selectable": "selectName"
    },
        
    initialize: function (opts) {
      // _.bindAll(this, 'render', 'off', 'insertView', 'setView');
      this.preInit();
      this.views = {};
      this.model = opts.model;
      this.listenTo(this.model, 'rowClick', this.rowClick);
      this.listenTo(this.model, 'destroy', this.close);

      if (_.has(opts, 'cols')) this.cols = opts.cols;
      if (_.has(opts, 'template')) this.template = opts.template;
      if (_.has(opts, 'helpers')) this.helpers = opts.helpers;
      if (_.has(opts, 'parent')) this.parent = opts.parent;
      if (_.has(opts, 'context')) _.extend(this.context, opts.context); 

      
      this.listenTo(this.model, 'change', _.throttle(this.update, 5*1000));
      
      this.listenTo(this.model, 'check', this.check);
      this.listenTo(this.model, 'uncheck', this.uncheck);
      this.listenTo(this.model, 'remove', this.close);

      this.render();
      this.postInit();
    },
    
    dispatch: function () {
      this.model.dispatch.apply(this.model, arguments);
    },
        
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      this.context._item = this.model;
      _.extend(this.context, this.options);
      RowView.__super__.render.call(this, ctx);
      this.render_count++;
      return this;
    },
    
    onRender: function () {
      if (this.model.get('caller') === "<webapp>")
        this.$el.addClass('warning');
    },
    
    update: function () {
      if (this.render_lock === true) return;
      this.is_rendered = false;
      var self = this,
          css_classes = this.$el.attr('class').split(/\s+/),
          check_classes = $('i.check', this.$el).attr('class');
      
      this.render();
      
      // restore previous classes
      _.each(css_classes, function (cls) {
        this.$el.addClass(cls);
      }, this);

      // restore check
      this.$('i.check').attr('class', check_classes);

      this.$el.addClass('changed');
      
      setTimeout(function() {
        self.$el.removeClass('changed');
      }, 5000);
    }, // , { trailing: true, leading: true, maxWait: 5*5*1000 }
    
    // delegate click event with model to parent view
    rowClick: function (e) {
      var trigger = true;
      
      this.click++;
      
      if (this.click > 1) {
        clearTimeout(this.click_timer);
        this.click = 0;
      }
      
      if (e) {
        var $target = $(e.currentTarget),
            $et     = $(e.target),
            silent = ($et.parents('button').size() > 0) || 
              ($et.parents('.dropdown-menu').size() > 0) || 
              ($et.parents('a').size() > 0) || 
              ($et.is('a')) || ($et.is('button')) ||
              $et.hasClass('check');
        trigger = ($target.is(this.tagName) && !silent);
      }
      
      if (trigger && this.click === 1) {
        var self = this;

        this.click_timer = setTimeout(function () {
          self.className += " info";
          self.trigger('clicked', self);
          if (self.parent) {
            self.parent.trigger('row:clicked', self);
            if (self.parent.rowClick) {
              self.parent.rowClick(self.model, e);
            }
          }
          self.click = 0;
        }, 200);
      } 
    },
    
    clean: function () {
      var p_view, self = this;
      p_view = this.parent.getView('tbody');
      // this.model.stopListening();
      this.$('.btn-group').off();
      _.reject(p_view, function (view) { return view.cid == self.cid; });
    },
        
    check: function () {
      // console.log('highlighting', this.model.id);
      this.$el
        .addClass('warning')
        .addClass('checked');

      this.$('.check')
        .removeClass('icon-check-empty')
        .addClass('icon-check');
    },
    
    uncheck: function () {
      // console.log('unchecking', this.model.id);

      this.$el
        .removeClass('warning')
        .removeClass('checked');

      this.$('.check')
        .addClass('icon-check-empty')
        .removeClass('icon-check');
    } 
  });
  
  ServiceView = View.extend({
    defaultEvents: {
      'submit': 'doAction',
      'click a[data-action]': 'doAction',
      'click button[data-action]': 'doAction',
      "dblclick .selectable": "selectName"
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts || {};
      
      this.on('fetch', this.render);
      this.getData();
      // debug.log('Events', this.events(), this.$el, this.el);
    },
    
    getUrl: function () {
      return [settings.REST_API_PREFIX, 'services', this.name].join('/');
    },
    
    getData: function () {
      var self = this;
      var url = [this.getUrl(), this.methods.getData].join('/');
      
      $.put(url, { action: 'call'})
        .done(function (data) {
          self.data = data;
          self.trigger('fetch');
        });
    },
    
    render: function (ctx) {
      debug.log('ServiceView', this.el, this.$el);
      _.extend(this.context, { data: this.data });
      
      ServiceView.__super__.render.call(this, ctx);
      return this;
    },
    
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
      }
      
      this.runAction($target.data('action'), params);
    },
    
    runAction: function (action, data) {
      var self = this;
      var url = [this.getUrl(), action].join('/');
      var args = _.values(data);
      
      $.put(url, { action: 'call', args: args })
        .done(function (resp) {
          debug.log(resp);
          self.getData();
        })
        .fail(function (resp) {
          debug.log(resp);
        });
    }
  });


  PluginView = View.extend({
    defaultEvents: {
      'submit': 'doAction',
      'click a[data-action]': 'doAction',
      'click button[data-action]': 'doAction',
      "dblclick .selectable": "selectName"
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts || {};
      
      this.on('fetch', this.render);
      this.getData();
      // debug.log('Events', this.events(), this.$el, this.el);
    },
    
    getUrl: function () {
      return [settings.REST_API_PREFIX, 'services', this.name].join('/');
    },
    
    getData: function () {
      var self = this;
      var url = [this.getUrl(), this.methods.getData].join('/');
      
      $.put(url, { action: 'call'})
        .done(function (data) {
          self.data = data;
          self.trigger('fetch');
        });
    },
    
    render: function (ctx) {
      debug.log('ServiceView', this.el, this.$el);
      _.extend(this.context, { data: this.data });
      
      ServiceView.__super__.render.call(this, ctx);
      
      return this;
    },
    
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
      }
      
      this.runAction($target.data('action'), params);
    },
    
    runAction: function (action, data) {
      var self = this;
      var url = [this.getUrl(), action].join('/');
      var args = _.values(data);
      
      $.put(url, { action: 'call', args: args })
        .done(function (resp) {
          debug.log(resp);
          self.getData();
        })
        .fail(function (resp) {
          debug.log(resp);
        });
    }
  });
  
  TabView = View.extend({
    __name__: 'TabView',
    views: {},
    tabs: [],
    context: {},
    
    defaultEvents: {
      'click .nav-tabs a': 'tabToggle',
      'click .nav-pills a': 'tabToggle',
      "dblclick .selectable": "selectName"
    },
    
    initialize: function () {
      _.bindAll(this);
      TabView.__super__.initialize.apply(this, arguments);
      this.on('postrender', this.renderTabs);
      this.on('postrender', this.activateTab);
      this.context.tabs = this.getTabs;
      this.initTabs();
    },
    
    activateTab: function () {
      if (this.active_tab) this.showTab(this.active_tab);
    },
     
    tabToggle: function (e) {
      var $target = $(e.currentTarget);
        
      e.preventDefault();
      e.stopPropagation();
      this.showTab($target.attr('href'));
    },
    
    addTabView: function (view, opts) {
      opts = opts || {};
      view = this.insertView(view, 'tabs');
      
      if (opts.name) view.name = opts.name;
      
      this.listenTo(view, 'all', this.tabEvent);
      return view;
    },
    
    renderTabs: function () {
      _.each(this.getTabs(), function (tab) {
        var id = '#' + tab.slug();
        tab.setElement(this.$(id));
        tab.render();
      }, this);
    },
    
    getTabs: function () {
      return this.getView('tabs');
    },
    
    getTab: function (name) {
      var tabs = this.getTabs();
      return _(tabs).find(function (tab) { return tab.slug() === name; });
    },
    
    removeTab: function (name) {
      var tab = this.getTab(name);
      var tabs = this.getTabs();
      var idx = _.indexOf(tabs, tab);
      
      if (idx > -1) {
        tab.close();
        tabs.splice(idx, 1);
      }
    },
    
    showTab: function (tab) {
      var name = (tab.charAt(0) === '/') ? tab.slice(1) : tab,
          view = this.getTab(tab),
          $target = this.$('[href='+tab+']'),
          url = (this.getViewUrl().charAt(0) === '/') ? this.getViewUrl().slice(1) : this.getViewUrl();

      if (view) view.trigger('show');

      $target.tab('show');
   
      if (this.active_tab !== name) {
        this.updateUrl([url, name].join('/'));
        this.active_tab = name;
        this.onTabChange(tab);
      }
    },
    
    onTabChange: function () {},
    
    updateUrl: function (url) {
      Backbone.history.navigate(url);
    },
    
    onProcessPath: function (tab) {
      this.active_tab = tab;
    },
    
    close: function () {
      TabView.__super__.close.apply(this, arguments);
//      console.log(this.views, this.getTabs());
    },
    
    initTabs: function () {
      if (_.size(this.tabs) > 0) {
        _.each(this.tabs, function (view, tab) {
          var view_obj,
              opts = {};
          
          if (!_.isFunction(view)) {
            view_obj = view;
            view = view_obj.view;
            opts = view_obj.options || {};
          }
          
          opts = _.chain(opts)
            .extend(_.omit(this.options, 'template'))
            .extend(_.omit(this.opts, 'template'))
            .value();
          
          this.addTabView(new view(opts), { name: tab });
        }, this);
      }
    },
    
    tabEvent: function () {}
  });
  
  ModelView = View.extend({
    __name__: 'ModelView',
    initialize: function () {
      ModelView.__super__.initialize.apply(this, arguments);
      this.model = this.options.model;
      this.on('prerender', this.addContext);
    },
    
    addContext: function () {
      if (this.model) {
        this.context.item = this.model.toJSON();
        this.context._item = this.model;        
      }
    }
  });

  CollectionView = View.extend({
    __name__: 'CollectionView',
    initialize: function () {
      CollectionView.__super__.initialize.apply(this, arguments);
      if (this.options.collection) this.collection = this.options.collection;
    },
    
    preRender: function () {
      if (this.collection) {
        this.context.collection = this.collection.toJSON();
        this.context._collection = this.collection;        
      }
    }
  });
  
  LoaderView = View.extend({
    template: '<p class="loader"><i class="icon-spin icon-spinner"></i> Loading...</p>'
  });

  return {
    View: View,
    ListView: ListView,
    LoaderView: LoaderView,
    ViewHelpers: Helpers,
    TableView: TableView,
    RowView: RowView,
    ServiceView: ServiceView,
    TabView: TabView,
    ModelView: ModelView,
    CollectionView: CollectionView
  };
});
