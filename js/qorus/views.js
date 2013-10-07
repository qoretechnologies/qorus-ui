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
  'text!../../templates/common/nodata.html'
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
    subviews: {},
    helpers: {},
    options: {},
    model_name: null,
    
    events : function () {
      return _.extend({}, this.defaultEvents, this.additionalEvents);
    },
    
    initialize: function (options) {
      _.bindAll(this);
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
        
    off: function () {
      if (_.isFunction(this.clean)) {
        this.clean();
      }
      _.each(this.subviews, function (view) {
        // console.log('view', view);
        if (view instanceof Backbone.View) {
          view.undelegateEvents();
          // view.remove();          
        }
      });
      this.undelegateEvents();
      // this.remove();
    },
    
    // manages subviews
    assign : function (selector, view) {
      var selectors;
      if (_.isObject(selector)) {
        selectors = selector;
      }
      else {
        selectors = {};
        selectors[selector] = view;
      }
      if (!selectors) return;
      _.each(selectors, function (view, selector) {
          view.setElement(this.$(selector)).render();
        }, this);
    },
    
    render: function (ctx) {
      if (this.template) {
        if (ctx) {
          _.extend(this.context, ctx); 
        }
        
        // adding template helpers
        _.extend(this.context, Helpers, this.helpers);

        var tpl = _.template(this.template, this.context);
        this.$el.html(tpl);
        this.trigger('render', this, {});
      }
      this.setTitle();
      this.onRender();
      return this;
    },
    
    onRender: function () {
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
      this.stopListening();
    },
    
    updateModels: function (e) {
      if (e.info) {
        var m = this.collection.get(e.info.id);
        console.log('Updating model', m);
        m.fetch();
      }
    },
    
    doNothing: function (e) {
      console.log('Do nothing', e);
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
      'click th': 'sortView',
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
      
      if (collection) {
        this.collection = new collection({ date: this.date, opts: this.opts });
        
        var _this = this;
        this.listenToOnce(this.collection, 'sync', this.render);
        this.listenToOnce(this.collection, 'error', this.render);
        
        // re-render after sort - TODO: fix - actually renders twice with first fetch :-/
        this.listenTo(this.collection, 'resort', this.render);
        
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
      // console.log('Starts rendering with context ->', this.context.page.has_next);
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
        var _this = this;
        _.defer(function () { _this.afterRender(); });
      }
      
      this.setTitle();
      this.onRender();
      this.sortIcon();
      console.log('Finished rendering', this);
      return this;
    },
    
    historyBack: function (e) {
      e.preventDefault();
      console.log("back button", e);
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
          console.log(resp);
        });
    },
    
    enableActions: function (e) {
      var ids = this.getCheckedIds();
      
      console.log(this.$el, $('.toolbar-actions', this.$el).attr('class'));
      
      if (ids.length > 0) {
        $('.toolbar-actions', this.$el).removeClass('hide');
      } else {
        $('.toolbar-actions', this.$el).addClass('hide');
      }
    },
    
    // end batch section definition
    
    runAction: function (e) {
      console.log('run action', e);
      var $target = $(e.currentTarget);
      var data = e.currentTarget.dataset;
      
      if (data.action && data.action != 'open' && data.action !== 'execute') {
        if (data.id == 'selected') {
          this.runBatchAction(data.action, data.method);
        } else if (data.id) {
          if (!$target.hasClass('action-modal')) {
            console.log("data action", data.id, data.action);
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
    
    // enable table fixed header
    fixHeader: function () {
      $(this.el).find('table').fixedHeaderTable();
    },
    
    // sort view
    sortView: function (e) {
      console.log("Sort by ", e);
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
    }
  });

  var TableView = View.extend({
    template: TableTpl,
    row_template: undefined,
    dispatcher: undefined,
    
    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts || {};
      
      this.collection = opts.collection;
      
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
      if (this.collection.size() < 1) {
        this.template = NoDataTpl;
      } else {
        this.opts.template = this.opts.template;
      }
      
      TableView.__super__.render.call(this, ctx);
      return this;
    },
    
    createRows: function () {
      var tv = this;
      this.subviews.rows = [];
      
      _.each(this.collection.models, function (m) {
        tv.addRow(m);
      });
    },
    
    appendRows: function (models) {
      var tv = this;
      _.each(models, function (m) {
        tv.addRow(m);
      });
    },
    
    onRender: function () {
      this.createRows();
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
      return this.subviews.rows(id);
    },
    
    addRow: function (m) {
      // console.log('adding row', this.subviews.rows, _.has(this.subviews.rows, m.id));
      if (!_.has(this.subviews.rows, m.id)) {
        var row = new RowView({ model: m, template: this.row_template, helpers: this.helpers, parent: this });
        this.$el.find('tbody').append(row.$el.html());
        this.subviews.rows[m.id] = row;        
      }

      // TODO: move to model itself???
      // if (this.dispatcher) {
      //   row.listenTo(this.dispatcher, row.model._name, function (e) {
      //     if (e.info.id == row.model.id) {
      //       row.model.fetch();
      //     }
      //   })
      // }
    },
    
    update: function () {
      var tv = this;
      _.each(this.collection.models, function (m) {
        tv.addRow(m);
      });
    },
    
    clean: function () {
      console.log("Cleaning table");
      _.each(this.subviews, function (sbv) {
        if (_.has(sbv, "clean")) {
          sbv.clean();
          sbv.remove();
        }
      })
    }
  });

  var RowView = View.extend({
    context: {},
    template: TableRowTpl,
    initialize: function (opts) {
      _.bindAll(this);
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
        , _this = this;

      // update row on model change
      this.listenTo(this.model, 'change', function () {
        var timeout = 500;
        _this._rtimer_buffer = _this._rtimer_buffer || 0;
        
        if (_this._rtimer) {
          clearTimeout(_this._rtimer);
          _this._rtimer_buffer++;
        }

        if (_this._rtimer_buffer >= 100) timeout = 0;

        _this._rtimer = setTimeout(function () {
          // console.log('delayed render of row', _this.model.id, new Date());
          _this.update();
          _this._rtimer_buffer = 0;
        }, timeout);
      });

      
      this.render();
    },
        
    render: function(ctx) {
      this.context.item = this.model;
      _.extend(this.context, this.options);
      RowView.__super__.render.call(this, ctx);
      return this;
    },
    
    update: function(ctx) {
      var _this = this;
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
        _this.parent.$el.find('[data-id=' + _this.model.id + ']').removeClass('changed');
      }, 5000);
    },
    
    clean: function () {
      console.log("Cleaning row");
      this.stopListening();
      this.undelegateEvents();
    }
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
      // console.log('Events', this.events(), this.$el, this.el);
    },
    
    getUrl: function () {
      return [settings.REST_API_PREFIX, 'services', this.name].join('/');
    },
    
    getData: function () {
      var _this = this;
      var url = [this.getUrl(), this.methods.getData].join('/');
      
      $.put(url, { action: 'call'})
        .done(function (data) {
          _this.data = data;
          _this.trigger('fetch');
        });
    },
    
    render: function (ctx) {
      console.log('ServiceView', this.el, this.$el);
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
      var _this = this;
      var url = [this.getUrl(), action].join('/');
      var args = _.values(data);
      
      $.put(url, { action: 'call', args: args })
        .done(function (resp) {
          console.log(resp);
          _this.getData();
        })
        .fail(function (resp) {
          console.log(resp);
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
      // console.log('Events', this.events(), this.$el, this.el);
    },
    
    getUrl: function () {
      return [settings.REST_API_PREFIX, 'services', this.name].join('/');
    },
    
    getData: function () {
      var _this = this;
      var url = [this.getUrl(), this.methods.getData].join('/');
      
      $.put(url, { action: 'call'})
        .done(function (data) {
          _this.data = data;
          _this.trigger('fetch');
        });
    },
    
    render: function (ctx) {
      console.log('ServiceView', this.el, this.$el);
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
      var _this = this;
      var url = [this.getUrl(), action].join('/');
      var args = _.values(data);
      
      $.put(url, { action: 'call', args: args })
        .done(function (resp) {
          console.log(resp);
          _this.getData();
        })
        .fail(function (resp) {
          console.log(resp);
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
