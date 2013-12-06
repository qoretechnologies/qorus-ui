// Qorus core objects definition
define(function (require) {
  var $           = require('jquery'),
      _           = require('underscore'),
      Backbone    = require('backbone'),
      Keys        = require('backbone.keys'),
      settings    = require('settings'),
      utils       = require('utils'),
      TableTpl    = require('tpl!templates/common/table.html'),
      TableRowTpl = require('tpl!templates/common/tablerow.html'),
      NoDataTpl   = require('tpl!templates/common/nodata.html'),
      Helpers     = require('qorus/helpers'),
      Loader, View, ListView, TableView, RowView, 
      TableAutoView, TableBodyView, ServiceView, PluginView;

  $.extend($.expr[':'], {
    'icontains': function (elem, i, match) //, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
  
  Loader = Backbone.View.extend({
    template: '<div class="loader"><p><img src="/imgs/loader.gif" /> Loading...</p></div>',
    initialize: function (opts) {
      this.el = opts.el;
      _.bindAll(this);
      this.render();
    },
    render: function () {
      $(this.el).before(this.template);
    },
    destroy: function () {
      $(this.el).parent().find('.loader').remove();
    }
  });
  
  
  View = Backbone.View.extend({
    render_lock: false,
    cls: 'View',
    url: '/',
    additionalEvents: {},
    defaultEvents: {
      "submit": "doNothing"
      // "click a[href^='/']": 'catchAClick'
    },
    context: {},
    views: {},
    helpers: {},
    options: {},
    model_name: null,
    opts: {},
    
    events : function () {
      return _.extend({}, this.defaultEvents, this.additionalEvents);
    },
    
    initialize: function (options) {
      this.views = {};
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
    },
        
    off: function (remove) {
      this.removeViews();
      
      if (_.isFunction(this.clean)) {
        this.clean();
      }
      
      View.__super__.off.call(this);

      if (remove != false) {
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
        debug.log('Template rendered', this.cls, this.cid, new Date().getTime() - start, 'ms');
        this.trigger('render', this, {});
      }

      debug.log('pre renderViews', this.cls, this.cid, new Date().getTime() - start, 'ms');
      // console.time('renderViews ' + this.cls);    
      this.renderViews();
      // console.timeEnd('renderViews ' + this.cls);
      debug.log('after renderViews', this.cls, this.cid, new Date().getTime() - start, 'ms');      
      this.setTitle();
      debug.log('after setTitle', this.cls, this.cid, new Date().getTime() - start, 'ms');
      // console.time('onRender ' + this.cls);
      this.onRender();
      // console.timeEnd('onRender ' + this.cls);
      debug.log('Rendering view', this.cls, this.cid, new Date().getTime() - start, 'ms');
      return this;
    },
    
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
    
    getView: function (id) {
      return this.views[id];
    },
    
    renderView: function (id, view) {
      if (!view) {
        view = this.getView(id);
      }
      
      if (view instanceof Backbone.View) {
        view.setElement(self.$(id)).render();
      } else if (_.isArray(view)) {
        // console.time('renderViews' + self.cls);
        var $el = this.$(id),
          el = $el.get(0);
        
        if (el){
          while(el.firstChild)
            el.removeChild(el.firstChild);            
        }
          
        var frag = document.createDocumentFragment();

        debug.log('creating fragment', id, frag);

        _.each(view, function (v) {
          frag.appendChild(v.el);
        });
        
        $(frag).appendTo($el);
        // console.timeEnd('renderViews ' + self.cls);
      }
      
    },
    
    renderViews: function () {
      var self = this;
      _.each(self.views, function (view, id) {        
        self.renderView(id, view);
      });
    },
    
    preRender: function () {
    },
    
    onRender: function () {
    },
    
    insertView: function (view, el, append) {
      var views;
      
      if (this.views[el]) {
        views = this.views[el];
      } else {
        views = this.views[el] = [];
      }
      
      el = el || '';
      
      if (views instanceof Backbone.View) {
        var old_view = views;
        views = [old_view];
      }
        
      views.push(view);

      return view;
    },
    
    setView: function (view, el, set) {
      this.removeView(el);
      this.views[el] = view;

      // debug.log('setting view', view, el, set);
      if (set === true) {
        // console.log('setting element on view', el, this.$(el));
        view.setElement(this.$(el)).render();
      }
      
      return view;
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
    }
   });


   ListView = View.extend({
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
      // "show": function (e) { console.log('shown', arguments )}
    },
    
    events : function () {
      return _.extend({}, this.defaultEvents, this.additionalEvents);
    },
    
    initialize: function (collection, date) {
      var self = this;
      _.bindAll(this);
      ListView.__super__.initialize.call(this);
      // add element loader
      this.loader = new Loader({ el: $('#wrap') });
      this.loader.render();

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
          this.collection = new collection(this.opts);
        }
        
        this.listenToOnce(this.collection, 'sync', this.render);
        this.listenToOnce(this.collection, 'error', this.render);
        
        this.collection.fetch();
        
        var _c = this.collection;
      
        this.context.page = {
          current_page: _c.page,
          has_next: _c.hasNextPage,
          has_prev: null
        };
      }
      
      this.on('highlight', this.enableActions);
      this.on('highlight', this.updateCheckIcon);
    },
    
    render: function (ctx) {
      var ctx, tpl, self = this;
      
      this.removeViews();
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
        
        if (this.loader && this.collection.size() > 0)
          this.loader.destroy();
        this.trigger('render', this, {});
      }
    
      if (_.isFunction(this.afterRender)) {
        // Run afterRender when attached to DOM
        self = this;
        _.defer(function () { self.afterRender(); });
      }
      this.renderViews();
      this.setTitle();
      this.onRender();
      debug.log('Finished rendering', this);
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
      $('.table-row')
        .removeClass('warning')
        .removeClass('checked');

      $('.table-row .check')
        .removeClass('icon-check')
        .addClass('icon-check-empty');
    },
    
    checkRow: function (id) {
      var $row = $('.table-row[data-id='+ id +']');
      
      $row
        .addClass('warning')
        .addClass('checked');

      $('.check', $row)
        .removeClass('icon-check-empty')
        .addClass('icon-check');
    },
    
    updateCheckIcon: function () {
      var $checker = this.$('i.checker');
      var total = this.$('tbody tr').size();
      var selected = this.getCheckedIds().length;

      if (selected == 0) {
        $checker
          .removeClass('icon-check')
          .removeClass('icon-check-minus')
          .removeClass('uncheck-all')
          .addClass('icon-check-empty')
          .addClass('check-all')
      } else if (selected == total) {
        $checker
          .removeClass('icon-check-minus')
          .removeClass('icon-check-empty')
          .removeClass('check-all')
          .addClass('icon-check')
          .addClass('uncheck-all')
      } else {
        $checker
          .removeClass('icon-check')
          .removeClass('icon-check-empty')
          .removeClass('uncheck-all')
          .addClass('icon-check-minus')
          .addClass('check-all')        
      }
      
    },
    
    invert: function (e) {      
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
      })

      return ids;
    },
    
    // do batch action
    runBatchAction: function (action, method, params) {
      var method = method || 'get';
      var ids = this.getCheckedIds();
      var params = { action: action, ids: ids.join(',') };
      
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
    
    enableActions: function (e) {
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
      debug.log('run action', e);
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
    }
  });

  TableView = View.extend({
    messages: {
      'nodata': "No data found"
    },
    cached_views: {},
    cls: 'TableView',
    fixed: false,
    additionalEvents: {
      'click th': 'sortView',
    },
    template: TableTpl,
    row_template: undefined,
    dispatcher: undefined,
    
    initialize: function (opts) {
      _.bindAll(this);
      var self = this;
      this.RowView = RowView;
      this.views = {};
      this.opts = opts || {};
      
      debug.log('table view collection', this.collection);
      this.collection = opts.collection;

      this.listenTo(this.collection, 'sync remove', self.update);
      this.listenTo(this.collection, 'resort sort', self.update);
      // this.listenTo(this.collection, 'add', function (model) {
      //   self.appendRow(model);
      // });
      // this.listenTo(this.collection, 'all', function () {
      //   console.log(arguments, this.collection.length);
      // });

      
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
      debug.log(this, this.colleciton);

      if (!this.collection || this.collection.size() == 0) {
        this.template = NoDataTpl;
      } else {
        this.opts.template = this.opts.template;
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
      if (this.collection.hasNextPage()) {
        this.$el.append($('<button class="btn btn-primary" data-pagination="loadNextPage">Load Next... </button>'));
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
      self.$('.table-fixed').fixedHeader('remove');
      $(window).off('resize.table');
      this.$el.closest('.pane').off('scroll');
    },
    
    scroll: function (ev) {
      // if not visible do nothing
      if (!this.$el.is(':visible')) return;

      var pos = this.$el.height() + this.$el.offset().top - $(window).height();
  
      if (pos < 100) {
        this.collection.loadNextPage(); 
        this.$('button[data-pagination]').html("Loading...");
      }
    },

    appendRows: function (models) {
      var self = this,
        frag = document.createDocumentFragment(),
        views;

      _.each(models, function (m) {
        var view = self.appendRow(m, false);
        frag.appendChild(view.render().el);
      });
      
      this.$('tbody').append(frag);
    },

    appendRow: function (m, render) {
      var view = this.insertView(new this.RowView({ 
        model: m, 
        template: this.row_tpl, 
        helpers: this.helpers, 
        parent: this, 
        row_attributes: this.row_attributes 
      }), 'tbody');

      render = (render===undefined) ? true : render;
      
      if (render)
        this.$('tbody').append(view.render());
      
      return view;
    },
        
    update: function () {
      if (this.template == NoDataTpl) {
        this.template = this.opts.template;
        this.render();
      }
      
      this.removeView('tbody');
      this.appendRows(this.collection.models);
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
        this.collection.sort_history.push(prev_key);

        views = views.sort(function (c1, c2) {
          // needs speed improvements
          var k10 = utils.prep(c1.model.get(key))
            , k20 = utils.prep(c2.model.get(key))
            , r = 1
            , k11, k21;
          
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
        delete this.views['tbody'];
        
        // resetting the element
        this.setView(views, 'tbody');
        this.renderView('tbody');
        this.sortIcon();
      }
    },
    
    sortIcon: function () {
      // console.time('sortIcon');
      var key = this.collection.sort_key,
        order = this.collection.sort_order,
        $el = this.$('[data-sort="'+ key +'"]');
      
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
      
      // console.timeEnd('sortIcon');
    }
  });
  
  TableAutoView = TableView.extend({
    columns: []
  });
  
  TableBody = View.extend({
    tagName: 'tbody',
    context: {},
    initialize: function (opts) {
      
    }
  });

  RowView = View.extend({
    tagName: 'tr',
    className: 'table-row',
    context: {},
    template: TableRowTpl,
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

    additionalEvents:  {
      'click': 'rowClick'
    },
        
    initialize: function (opts) {
      var model = this.model, 
        self = this;

      // _.bindAll(this);
      this.views =[];
      this.model = opts.model;

      if (_.has(opts, 'cols')) this.cols = cols;
      if (_.has(opts, 'template')) this.template = opts.template;
      if (_.has(opts, 'helpers')) this.helpers = opts.helpers;
      if (_.has(opts, 'parent')) this.parent = opts.parent;
      if (_.has(opts, 'context')) _.extends(this.context, opts.context); 

      // update row on model change
      this.listenTo(this.model, 'change', function (e) {
        var timeout = 500;
        self._rtimer_buffer = self._rtimer_buffer || 0;
        
        if (self._rtimer) {
          clearTimeout(self._rtimer);
          self._rtimer_buffer++;
        }
              
        if (self._rtimer_buffer >= 100) timeout = 0;
              
        self._rtimer = setTimeout(function () {
          // debug.log('delayed render of row', self.model.id, new Date());
          self.update();
          self._rtimer_buffer = 0;
        }, timeout);
      });

      this.render();
    },
        
    render: function (ctx) {
      // console.log('rendering', this.model.id);
      this.context.item = this.model.toJSON();
      _.extend(this.context, this.options);
      RowView.__super__.render.call(this, ctx);
      return this;
    },
    
    onRender: function () {
      this.$('.btn-group').on('shown.bs.dropdown', this.lock);
      this.$('.btn-group').on('hidden.bs.dropdown', this.unlock);
    },
    
    update: function (ctx) {
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
    
    // delagate click event with model to parent view
    rowClick: function (e) {
      this.trigger('clicked', this);
      if (this.parent) {
        this.parent.trigger('row:clicked', this);
        if (this.parent.rowClick) {
          this.parent.rowClick(this.model, e);
        }
      }
    }
  });
  
  ServiceView = View.extend({
    defaultEvents: {
      'submit': 'doAction',
      'click a[data-action]': 'doAction',
      'click button[data-action]': 'doAction'
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
        var params = {};
      
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
      'click button[data-action]': 'doAction'
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
        var params = {};
      
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

  return {
    View: View,
    ListView: ListView,
    Loader: Loader,
    ViewHelpers: Helpers,
    TableView: TableView,
    RowView: RowView,
    ServiceView: ServiceView
  };
});
