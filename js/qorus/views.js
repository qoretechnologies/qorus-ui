// Qorus core objects definitions
define(function (require) {
  var $           = require('jquery'),
      _           = require('underscore'),
      Backbone    = require('backbone'),
      // Keys     = require('backbone.keys'),
      settings    = require('settings'),
      utils       = require('utils'),
      Dispatcher  = require('qorus/dispatcher'),
      TableTpl    = require('tpl!templates/common/table.html'),
      TableRowTpl = require('tpl!templates/common/tablerow.html'),
      NoDataTpl   = require('tpl!templates/common/nodata.html'),
      Helpers     = require('qorus/helpers'),
      moment      = require('moment'),
      Filtered    = require('backbone.filtered.collection'),
      Loader, View, ListView, TableView, RowView, 
      TableAutoView, ServiceView, PluginView, 
      TabView, ModelView, THeadView, TBodyView, TFootView, TRowView;

  $.extend($.expr[':'], {
    'icontains': function (elem, i, match) //, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
  
  Loader = Backbone.View.extend({
    tagName: 'div',
    className: 'loader',
    template: '<p><img src="/imgs/loader.gif" /> Loading...</p>',
    initialize: function (opts) {
      _.bindAll(this, 'render', 'destroy');
      this.opts = opts || {};
      this.render();
    },
    render: function () {
      var el = this.opts.el || 'body';
      
      this.$el.html(this.template);  
      this.$el.appendTo(el);
      
      return this;
    },
    destroy: function () {
      this.$el.remove();
    }
  });
  
  View = Backbone.View.extend({
    render_lock: false,
    __name__: 'View',
    upstreamUrl: "",
    url: '',
    defaultEvents: {
      "submit": "doNothing",
      "dblclick .selectable": "selectName"
      // "click a[href^='/']": 'catchAClick'
    },
    context: {},
    views: {},
    helpers: {},
    options: {},
    model_name: null,
    opts: {},
    path: "",
    _is_rendered: false,
    
    // merging defaultEvents with additionalEvents
    events : function () {
      var aEvents = this.additionalEvents || {};
      return _.extend({}, this.defaultEvents, aEvents);
    },
    
    
    initialize: function (options) {
      _.bindAll(this, 'render');
      this.views = {};
      this.context = {};
      this.views = {};
      this.options = {};
      
      View.__super__.initialize.call(this, [options]);
      // set DATE format and init date
      this.date_format = settings.DATE_DISPLAY;

      if (_.isObject(options)) {
        if (options.date === undefined || options.date === null) {
          options.date = moment().add('days', -1).format(this.date_format);
        } else if (options.date == 'all') {
          options.date = moment(settings.DATE_FROM).format(this.date_format);
        }        
      }
      
      _.extend(this.context, options);
      _.extend(this.options, options);
      
      if (_.has(this.options, 'template')) this.template = this.options.template;
      this.processPath();
    },
        
    off: function (remove) {
      this.removeViews();
      
      if (_.isFunction(this.clean)) {
        this.clean();
      }
      
      this.trigger('destroy');
      View.__super__.off.call(this);

      if (remove !== false) {
        this.$el.remove();
        this.remove();
      }
      this.views = {};
    },
    
    render: function (ctx) {
      var start = new Date().getTime(), tpl;
      
      if (this.render_lock) return;
      // this.removeViews();

      this.trigger('prerender', this);
      this.preRender();

      if (this.template) {
        if (ctx) {
          _.extend(this.context, ctx); 
        }
        
        // adding template helpers
        _.extend(this.context, Helpers, this.helpers);

        if (_.isFunction(this.template)) {
          tpl = this.template(this.context);
        } else {
          tpl = _.template(this.template, this.context);
        }
        // console.log('rendering', tpl.slice(0,100), this.el.id);
        this.$el.html(tpl);
        // debug.log('Template rendered', this.cls, this.cid, new Date().getTime() - start, 'ms');
        this.trigger('render', this, {});
      }

      // debug.log('pre renderViews', this.cls, this.cid, new Date().getTime() - start, 'ms');
      // console.time('renderViews ' + this.cls);    
      this.renderViews();
      // console.timeEnd('renderViews ' + this.cls);
      // debug.log('after renderViews', this.cls, this.cid, new Date().getTime() - start, 'ms');      
      this.setTitle();
      // debug.log('after setTitle', this.cls, this.cid, new Date().getTime() - start, 'ms');
      // console.time('onRender ' + this.cls);
      this.onRender();
      // console.timeEnd('onRender ' + this.cls);
      // debug.log('Rendering view', this.cls, this.cid, new Date().getTime() - start, 'ms');
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
        view.off();
      } else if (_.isArray(view)) {
        // console.log(id, 'is array');
        _.each(view, function (v) {
          v.off();
        });
      }
      if (view) delete this.views[id];
    },
    
    // removes all subviews
    removeViews: function () {
      _.each(this.views, function (view) {
        debug.log('removing subviews');
        if (_.isArray(view)) {
          _.each(view, function (v) {
            // debug.log('removing view from array', v.cid);
            v.off();
          });
        } else if (view instanceof Backbone.View) {
          // debug.log('removing view', view.cid);
          view.off();
        }
      });
      this.views = {};
    },
    
    // returns view by specified id, el id attr in the most cases
    getView: function (id) {
      if (id in this.views)
        return this.views[id];

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
          el = $el.get(0);
        
        if (el){
          while(el.firstChild)
            el.removeChild(el.firstChild);            
        }
          
        var frag = document.createDocumentFragment();

        _.each(view, function (v) {
          if (v.el) frag.appendChild(v.el);
        });
        
        $(frag).appendTo($el);
      }
    },
    
    // renders subviews
    renderViews: function () {
      var self = this;
      _.each(self.views, function (view, id) {
        if (id!=='tabs')  self.renderView(id, view);
      });
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
      var views, old_view;
      
      this._updateViewUrl(view);
      
      if (this.views[el]) {
        views = this.views[el];
      } else {
        views = this.views[el] = [];
      }
      
      el = el || '';
      
      if (views instanceof Backbone.View) {
        old_view = views;
        views = [old_view];
      }
        
      view.view_idx = views.push(view) - 1;
      
      if (append === true) {
        this.$(el).append(view.render().$el);
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
        view.setElement(this.$(el)).render();
      }
      
      return view;
    },
    
    _updateViewUrl: function (view) {
      if (view instanceof Backbone.View) {
        view.processPath(this.processPath(null, true));
        view.upstreamUrl = this.getViewUrl();
      }
    },
    
    // sets document title if defined in view
    setTitle: function () {
      var title, inst;
      
      if (this.title) {
        title = _.isFunction(this.title) ? this.title() : this.title;
        inst = document.title.match(/(.*)\| /g);
        if (inst) {
          document.title = inst[0];
        } else {
          document.title = "";
        }

        document.title += " " + title; 
      }
    },
    
    clean: function () {
      // debug.log('called stop listening on', this.cid);
      this.stopListening();
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
    },
    
    lock: function () {
      // console.log(this.cid, 'locked');
      this.render_lock = true;
    },
    
    unlock: function () {
      // console.log(this.cid, 'unlocked');
      this.render_lock = false;
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
    }
   });


   ListView = View.extend({
     context: {},
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
    
    initialize: function (collection, date, options) {
      _.bindAll(this, 'render');
      ListView.__super__.initialize.call(this, options);
      // add element loader
      // this.loader = new Loader({ el: $('#wrap') });
      // this.loader.render();

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
      
      if (collection) {
        if (collection instanceof Backbone.Collection) {
          this.collection = collection;
        } else {
          this.collection = new collection([], this.opts);
        }
        
        this.listenToOnce(this.collection, 'sync', this.render);
        this.listenToOnce(this.collection, 'error', this.render);
        
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
      
      
      this.on('highlight', this.enableActions);
      this.on('highlight', this.updateCheckIcon);
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

      } else {
        this.uncheckAll();
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
    },
    
    checkRow: function (id) {
      var model = this.collection.get(id);
      
      if (model) {
        model.trigger('check');
      }
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
      var $target = $(e.currentTarget);
      var $el = $(this.el);
      var query = $target.hasClass('search-query') ? $target.val() : $target.find('.search-query').val();
      
      if (query.length < 1) {
        $el.find('tbody tr').show();
      } else {
        $el.find('tbody tr').hide();
        _.each(query.split(settings.SEARCH_SEPARATOR), function(keyword){
          $el.find("tbody td:icontains('" + keyword + "')").parent().show();
        });
      }
      
      // prevent reload if submited by form
      if (e.type == "submit") {
        e.preventDefault();
      }
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
      _.bindAll(this);
      this.RowView = this.row_view || RowView;
      this.views = {};
      this.opts = opts || {};
      
      debug.log('table view collection', this.collection);
      this.collection = opts.collection;

      this.listenTo(this.collection, 'add', this.appendRow);
      this.listenTo(this.collection, 'resort', this.update);
      
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
      
      this.update();
    },
    
    render: function (ctx) {
      if (!this.collection || this.collection.size() === 0) {
        this.template = NoDataTpl;
      } else {
        this.template = this.opts.template;
      }
      
      this.context.messages = this.messages;

      TableView.__super__.render.call(this, ctx);
      return this;
    },
       
    onRender: function () {
      if (this.fixed === true) {
        this.$('.table-fixed').fixedHeader();
      }

      this.sortIcon();
      this.setWidths();
      
      $(window).on('resize.table', this.resize);
      
      if (this.collection.pagination) 
        this.$el.closest('.pane').on('scroll', this.scroll);
      
      
      // load next button
      if (this.collection.hasNextPage) {
        if (this.collection.hasNextPage()) {
          this.$el.append($('<button class="btn btn-primary" data-pagination="loadNextPage">Load Next... </button>'));
        }        
      }
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
    
    resize: function () {
      // fix static header width and pos
      if (this.fixed === true) {
        this.$('.table-fixed').fixedHeader();
      }
      this.setWidths();
    },
    
    clean: function () {
      this.$('.table-fixed').fixedHeader('remove');
      $(window).off('resize.table');
      this.$el.closest('.pane').off('scroll');
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

    appendRows: function (models) {
      if ('tbody' in this.views) {
        this.update();
        return;
      }
      
      // console.time('appending');
      var frag = document.createDocumentFragment();

      _.each(models, function (m) {
        var view = this.appendRow(m, false);
        frag.appendChild(view.render().el);
      }, this);
      
      // for (var i=0; i<100; i++) {
      //   var view = this.appendRow(models[i], false);
      //   frag.appendChild(view.render().el);
      // }
      // console.timeEnd('appending');
      
      this.$('tbody').append(frag);
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
      
      if (render) {
        idx = this.collection.indexOf(m-1);
        if (this.$('tbody tr').get(idx)) {
          $(this.$('tbody tr').get(idx)).after(view.render().$el);
        } else {
          this.$('tbody').append(view.render().$el);
        }
      }
      
      return view;
    },
        
    update: function () {
      if (this.template == NoDataTpl) {
        this.template = this.opts.template;
        this.render();
      }
      
      this.removeView('tbody');
      this.appendRows(this.collection.models);
      // if (this.loader) this.loader.destroy();
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
    className: 'table-row clickable',
    context: {},
    template: TableRowTpl,
    timeout_buffer: 0,
    timeout_buffer_max: 200,
    timeout: null,
    timer: 0,
    timer_max: 10,
    
    attributes: function() {
      var data = { 'data-id': this.model.id },
        self = this;
      
      if (this.row_attributes) {
        _.each(this.row_attributes, function (atr) {
          var key = 'data-' + atr;
          data[key] = self.model.get(atr);
        });
      }
      return data;
    },
    
    defaultEvents: {
      'click': 'rowClick',
      'shown.bs.dropdown .btn-group': 'lock',
      'hidden.bs.dropdown .btn-group': 'unlock',
      "dblclick .selectable": "selectName"
    },
        
    initialize: function (opts) {
      var self = this;
      _.bindAll(this, 'update');

      // _.bindAll(this);
      this.views = [];
      this.model = opts.model;
      this.listenTo(this.model, 'rowClick', this.rowClick);
      this.listenTo(this.model, 'destroy', this.off);

      if (_.has(opts, 'cols')) this.cols = opts.cols;
      if (_.has(opts, 'template')) this.template = opts.template;
      if (_.has(opts, 'helpers')) this.helpers = opts.helpers;
      if (_.has(opts, 'parent')) this.parent = opts.parent;
      if (_.has(opts, 'context')) _.extend(this.context, opts.context); 

      // // update row on model change
      this.listenTo(this.model, 'change', function () {
        // enable throttling - possible replacement _.throttle(func, wait, options)
        var timeout = self.timer*1000;
        self._rtimer_buffer = self._rtimer_buffer || 0;
        
        if (self._rtimer) {
          clearTimeout(self._rtimer);
          self._rtimer_buffer++;
          if (self.timer < self.timer_max) self.timer++;
        }
              
        if (self._rtimer_buffer >= self.timeout_buffer_max) timeout = 0;
              
        self._rtimer = setTimeout(function () {
          // debug.log('delayed render of row', self.model.id, new Date());
          self.update();
          self._rtimer_buffer = 0;
          self.timer = 0;
        }, timeout);
      });
      
      this.listenTo(this.model, 'check', this.check);
      this.listenTo(this.model, 'uncheck', this.uncheck);
      
      // this.listenTo(Dispatcher, this.model.api_events, this.dispatch);

      this.render();
    },
    
    dispatch: function () {
      this.model.dispatch.apply(this.model, arguments);
    },
        
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      this.context._item = this.model;
      _.extend(this.context, this.options);
      RowView.__super__.render.call(this, ctx);
      return this;
    },
    
    onRender: function () {
      if (this.model.get('caller') === "<webapp>")
        this.$el.addClass('warning');
    },
    
    update: function () {
      if (this.render_lock === true) return;
      var self = this;
      var css_classes = this.$el.attr('class').split(/\s+/);
      var check_classes = $('i.check', this.$el).attr('class');
      
      this.render();
      
      // restore previous classes
      _.each(css_classes, function (cls) {
        self.$el.addClass(cls);
      });

      // restore check
      this.$('i.check').attr('class', check_classes);

      this.$el.addClass('changed');
      
      setTimeout(function() {
        self.$el.removeClass('changed');
      }, 5000);
    },
    
    // delegate click event with model to parent view
    rowClick: function (e) {
      var trigger = true;
      
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
      
      if (trigger) {
        this.trigger('clicked', this);
        if (this.parent) {
          this.parent.trigger('row:clicked', this);
          if (this.parent.rowClick) {
            this.parent.rowClick(this.model, e);
          }
        }
      } 
    },
    
    clean: function () {
      var p_view, self= this;
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
    
    defaultEvents: {
      'click .nav-tabs a': 'tabToggle',
      'click .nav-pills a': 'tabToggle',
      "dblclick .selectable": "selectName"
    },
    
    initialize: function () {
      _.bindAll(this, 'render', 'getTabs');
      TabView.__super__.initialize.call(this, arguments);
      this.on('postrender', this.activateTab);
      this.on('postrender', this.renderTabs);
      this.context.tabs = this.getTabs;
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
      return view;
    },
    
    renderTabs: function () {
      _.each(this.getTabs(), function (tab) {
        var id = '#' + tab.slug();
        tab.setElement(this.$(id));
        tab.render();
      });
    },
    
    getTabs: function () {
      return this.getView('tabs');
    },
    
    getTab: function (name) {
      var tabs = this.getTabs();
      return _(tabs).findWhere({'name': name});
    },
    
    removeTab: function (name) {
      var tab = this.getTab(name);
      var tabs = this.getTabs();
      var idx = _.indexOf(tabs, tab);
      
      if (idx > -1) {
        tab.off();
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
   
      if (name !== this.active_tab) {
        this.updateUrl([url, name].join('/'));
        this.active_tab = name;
      }
      this.onTabChange(tab);
    },
    
    onTabChange: function () {},
    
    updateUrl: function (url) {
      Backbone.history.navigate(url);
    },
    
    onProcessPath: function (tab) {
      this.active_tab = tab;
    }
  });
  
  ModelView = View.extend({
    __name__: 'ModelView',
    views: {},
    initialize: function () {
      ModelView.__super__.initialize.apply(this, arguments);
      
      this.model = this.options.model;
    },
    
    preRender: function () {
      this.context.item = this.model.toJSON();
      this.context._item = this.model;
      ModelView.__super__.preRender.apply(this, arguments);
    }
  });

  return {
    View: View,
    ListView: ListView,
    Loader: Loader,
    ViewHelpers: Helpers,
    TableView: TableView,
    RowView: RowView,
    ServiceView: ServiceView,
    TabView: TabView,
    ModelView: ModelView
  };
});