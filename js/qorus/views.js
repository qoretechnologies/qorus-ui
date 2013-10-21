// Qorus core objects definition
define([
  'jquery',
  'underscore',
  'backbone',
  'settings',
  'utils',
  'qorus/qorus',
  'qorus/helpers',
  'text!../../templates/common/table.html',
  'text!../../templates/common/tablerow.html',
  'text!../../templates/common/nodata.html',
  'bootstrap'
], function ($, _, Backbone, settings, utils, Qorus, Helpers, TableTpl, TableRowTpl, NoDataTpl) {
  $.extend($.expr[':'], {
    'icontains': function (elem, i, match) //, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
  
  var Loader = Backbone.View.extend({
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
  
  
  var View = Backbone.View.extend({
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

      this.undelegateEvents();
      this.stopListening();
      this.views = {};
      // this.context = null;
      
      View.__super__.off.call(this);
      if (remove !== false) {
        // this.$el.remove();
        this.remove();
      }
    },
    
    render: function (ctx) {
      this.preRender();
      if (this.template) {
        if (ctx) {
          _.extend(this.context, ctx); 
        }
        
        // adding template helpers
        _.extend(this.context, Helpers, this.helpers);

        var tpl = _.template(this.template, this.context);
        // console.log('rendering', tpl.slice(0,100), this.el.id);
        this.$el.html(tpl);
        this.trigger('render', this, {});
      }
      this.renderViews();
      this.setTitle();
      this.onRender();
      return this;
    },
    
    removeView: function (id) {
      var view = this.getView(id);
      if (view instanceof Backbone.View) {
        console.log(id, 'is backbone view removing');
        view.off();
      } else if (_.isArray(view)) {
        console.log(id, 'is array');
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
    
    renderViews: function () {
      var self = this;
      _.each(self.views, function (view, idx) {
        if (view instanceof Backbone.View) {
          view.setElement(self.$(idx)).render();
        } else if (_.isArray(view)) {
          var frag = document.createDocumentFragment();
          debug.log('creating fragment', idx, frag);
          _.each(view, function (v) {
            var fc = v.el.firstElementChild;
            frag.appendChild(v.setElement(fc).el);
          });
          $(frag).appendTo(self.$(idx));
          frag = null;
        }
      });
    },
    
    preRender: function () {
    },
    
    onRender: function () {
    },
    
    insertView: function (view, el) {
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
        // debug.log('setting element on view', el, this.$(el));
        view.setElement(this.$(el)).render();
      }
      
      return view;
    },
    
    // sets document title if defined in view
    setTitle: function () {
      if (!_.isUndefined(this.title)) {
        var title = _.isFunction(this.title) ? this.title() : this.title;
        var inst = document.title.match(/(.*)\| /g);
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
    }
   });


   var ListView = View.extend({
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
      "click a[data-back]": "historyBack"
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
        this.collection = new collection(this.opts);
        
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
      
      // this.on('highlight', this.enableActions);
      // this.on('highlight', this.updateCheckIcon);
    },
    
    render: function (ctx) {
      this.removeViews();
      this.preRender();
      // debug.log('Starts rendering with context ->', this.context.page.has_next);
      if (this.template) {
        var ctx = {
          date: this.date,
          items: this.collection.models
        };

        // adding template helpers
        _.extend(this.context, ctx, Helpers, this.helpers);
        
        var tpl = _.template(this.template, this.context);
        this.$el.html(tpl);
        if (this.loader && this.collection.size() > 0)
          this.loader.destroy();
        this.trigger('render', this, {});
      }
    
      if (_.isFunction(this.afterRender)) {
        // Run afterRender when attached to DOM
        var self = this;
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
      var $checker = $('i.checker', this.$el);
      var total = $('tbody tr', this.$el).size();
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
      } else if (method == 'dekete') {
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
          this.runBatchAction(data.action, data.method);
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
    // 
    // clean: function () {
    //   this.collection = null;
    // }
  });

  var TableView = View.extend({
    additionalEvents: {
      'click th': 'sortView',
    },
    template: TableTpl,
    row_template: undefined,
    dispatcher: undefined,
    
    initialize: function (opts) {
      _.bindAll(this);
      this.views = {};
      this.opts = opts || {};
      
      debug.log('table view collection', this.collection);
      this.collection = opts.collection;
      this.listenTo(this.collection, 'resort', this.render);
      
      if (_.has(opts, 'template')) {
        this.template = opts.template;
      }
      
      if (_.has(opts, 'row_template')) {
        this.row_template = opts.row_template;
      }
      
      if (_.has(opts, 'helpers')) {
        this.helpers = opts.helpers
      }
      
      if (_.has(opts, 'dispatcher')) {
        this.dispatcher = opts.dispatcher;
      }
      
      this.opts.template = this.template;
      
      _.extend(this.context, opts);
      _.extend(this.options, opts);
    },
    
    render: function (ctx) {
      debug.log(this, this.colleciton);
      if (!this.collection || this.collection.size() == 0) {
        this.template = NoDataTpl;
      } else {
        this.opts.template = this.opts.template;
      }
      
      TableView.__super__.render.call(this, ctx);
      return this;
    },
    
    // appendRows: function (models) {
    //   console.log('appending rows');
    //   var self = this;
    //   var frag = document.createDocumentFragment();
    //   _.each(models, function (m) {
    //     var view = self.insertView(new RowView({ model: m, template: self.row_template, helpers: self.helpers, parent: self }));
    //     frag.appendChild($(view.render().$el.html()));
    //   });
    //   this.$('tbody').append(frag);
    // },
    
    preRender: function () {
      this.update(false);
    },
       
    onRender: function () {
      // this.createRows();
      // this.update();
      this.sortIcon();
      this.$el.scroll(this.scroll);
    },
    
    scroll: function (ev) {
       var pos = this.$el.height() + this.$el.offset().top - $(window).height();
       if (pos < 100) {
         this.collection.loadNextPage(); 
         this.$el.children('button[data-pagination]').html("Loading...");
       }
    },
    
    getRow: function (id) {
      return this.subviews.rows[id];
    },
        
    update: function (render) {
      var self = this;
      var ctr = 0;
      if (render === undefined) render = true;
      // if ($tbody) {
      //   console.log($tbody.html());
      // }

      this.removeView('tbody');
      // console.log(this.views);
      debug.log('TableView views ->', this.views);
      
      _.each(this.collection.models, function (m) {
        // if (ctr <= 2) {
          var view = self.insertView(new RowView({ model: m, template: self.row_template, helpers: self.helpers, parent: self }), 'tbody');
        // }
        ctr++;
      });
      if (render) {
        this.render();
      }
    },
    
    // enable table fixed header
    fixHeader: function () {
      $(this.el).find('table').fixedHeaderTable();
    },
    
    // sort view
    sortView: function (e) {
      debug.log("Sort by ", e);
      var el = $(e.currentTarget);
      if (el.data('sort')) {
        this.collection.sortByKey(el.data('sort'), el.data('order'));
      }
    },
    
    sortIcon: function () {
        var c = this;
        var key = c.collection.sort_key;
        var order = c.collection.sort_order;
        var el = c.$el.find('th[data-sort="' + key + '"]');
        c.$el.find('th i.sort')
          .remove();

        if (order == 'des') {
          el.attr('data-order', 'asc');
          el.append('<i class="sort icon-chevron-down"></i>');
        } else {
          el.attr('data-order', 'des');
          el.append('<i class="sort icon-chevron-up"></i>');
        }
    }
  });

  var RowView = View.extend({
    context: {},
    template: TableRowTpl,
    initialize: function (opts) {
      // _.bindAll(this);
      this.views =[];
      this.model = opts.model;
      if (_.has(opts, 'cols')) {
        this.cols = cols; 
      }
      
      if (_.has(opts, 'template')) {
        this.template = opts.template;
      }
      
      if (_.has(opts, 'helpers')) {
        this.helpers = opts.helpers;
      }
      
      if (_.has(opts, 'parent')) {
        this.parent = opts.parent;
      }
      
      if (_.has(opts, 'context')) {
        _.extends(this.context, opts.context); 
      }
      
      var model = this.model
        , self = this;

      // update row on model change
      this.listenTo(this.model, 'change', function () {
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
        
    render: function(ctx) {
      this.context.item = this.model.toJSON();
      _.extend(this.context, this.options);
      RowView.__super__.render.call(this, ctx);
      return this;
    },
    
    update: function(ctx) {
      var self = this;
      var css_classes = [];
      var $previous_el = this.parent.$el.find('[data-id=' + this.model.id + ']');
      
      if ($previous_el.attr('class')) {
        css_classes = $previous_el.attr('class').split(/\s+/); 
      }
      
      this.render();
      
      var $el = this.$el.find('tr');
      
      // restore previous classes
      _.each(css_classes, function (cls) {
        $el.addClass(cls);
      });
      
      // restore check
      var check_classes = $('i.check', $previous_el).attr('class');
      $('i.check', $el).attr('class', check_classes);
      
      $el.addClass('changed');
      
      $previous_el.replaceWith($el);
      setTimeout(function() {
        self.parent.$el.find('[data-id=' + self.model.id + ']').removeClass('changed');
      }, 5000);
    },
    // 
    // clean: function () {
    //   debug.log('cleaning model');
    //   this.stopListening();
    //   this.model = null;
    //   this.parent = null;
    // }
    // 
    // clean: function () {
    //   debug.log("Cleaning row");
    //   this.undelegateEvents();
    // }
  });
  
  var ServiceView = View.extend({
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


  var PluginView = View.extend({
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

  var Views = {
    View: View,
    ListView: ListView,
    Loader: Loader,
    ViewHelpers: Helpers,
    TableView: TableView,
    RowView: RowView,
    ServiceView: ServiceView
  }

  return Views;
});
