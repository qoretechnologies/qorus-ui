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
], function ($, _, Backbone, settings, utils, Qorus, Helpers, TableTpl, TableRowTpl) {
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
        console.log('view', view);
        if (_.isArray(view)) {
          // _.each(view, function (v) {
          //   v.off();
          // });
          // _.each(view, function (v) {
          //   console.log("off", v);
          //   v.off();
          // });
          
        } else if (_.isObject(view)) {
          // if (_.isFunction(view.clean)) {
          //   view.clean();
          // }
          view.undelegateEvents();
          view.remove();      
        } // else {
//           view.off();
//         }
      });
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
        document.title = inst[0];
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
      'click th': 'sortView',
      'submit .form-search': 'search',
      'keyup .search-query': 'search'
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
      if (date === undefined || date === null) {
        this.date = moment().add('days', -1).format(this.date_format);
      } else if (date == 'all') {
        this.date = moment(settings.DATE_FROM).format(this.date_format);
      // } else if (date.match(/[0-9]+/)) {
      //   this.date = moment(date, 'YYYYMMDDHHmmss');
      } else {
        this.date = date;
      }    
      
      if (collection) {
        this.collection = new collection({ date: this.date });
        
        var _this = this;
        this.listenToOnce(this.collection, 'sync', this.render);
        this.listenTo(this.collection, 'all', function (e) {
          console.log(e)
        });
        
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
      console.log('Finished rendering');
      return this;
    },
    
    isEnabled: function (e) {
      return !$(e.currentTarget).hasClass('disabled');
    },
    
    // toggle select row
    highlight: function (e) {
      var el = e.currentTarget;
      $(el)
        .toggleClass('icon-check-empty')
        .toggleClass('icon-check');
      $(el)
        .parents('.table-row')
        .toggleClass('warning');
      e.stopPropagation();
    },
    
    fixHeader: function () {
      $(this.el).find('table').fixedHeaderTable();
    },
    
    // toggle select on all rows
    checkall: function (e) {
      var el = e.currentTarget;

      // behaviour switcher
      if ($(el)
        .hasClass('check-all')) {
        $(el)
          .toggleClass('icon-check-empty')
          .toggleClass('icon-check')
          .toggleClass('check-all')
          .toggleClass('uncheck-all');
        $('.workflow-row')
          .addClass('warning')
          .addClass('checked');
        $('.workflow-row .check')
          .removeClass('icon-check-empty')
          .addClass('icon-check');
      } else {
        $(el)
          .toggleClass('icon-check-empty')
          .toggleClass('icon-check')
          .toggleClass('check-all')
          .toggleClass('uncheck-all');
        $('.workflow-row')
          .removeClass('warning')
          .removeClass('checked');
        $('.workflow-row .check')
          .removeClass('icon-check')
          .addClass('icon-check-empty');
      }
      e.stopPropagation();
    },
    
    // sort view
    sortView: function (e) {
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
    }
  });

  var TableView = View.extend({
    template: TableTpl,
    row_template: undefined,
    dispatcher: undefined,
    
    initialize: function (opts) {
      _.bindAll(this);
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
      $('.pane').scroll(this.scroll);
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
      console.log('adding row', this.subviews.rows, _.has(this.subviews.rows, m.id));
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
      
      // update row on model change
      this.listenTo(this.model, 'change', this.update);
      // this.listenTo(this.model, 'all', function (e, ee) {
      //   console.log(e, ee);
      // });
      
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
      var $previous_el = this.parent.$el.find('[data-id=' + this.model.id + ']');
      var css_classes = $previous_el.attr('class').split(/\s+/);
      
      this.render();
      
      var $el = this.$el.find('tr');
      
      console.log(this, $el);
      
      // restore previous classes
      _.each(css_classes, function (cls) {
        $el.addClass(cls);
      })
      
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
    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts || {};
      
      this.on('fetch', this.render);
      this.getData();
    },
    
    getData: function () {
      var _this = this;
      var url = [settings.REST_API_PREFIX, 'services', this.name, this.methods.getData].join('/');
      
      $.put(url, { action: 'call'})
        .done(function (data) {
          _this.data = data;
          _this.trigger('fetch');
        });
    },
    
    render: function (ctx) {
      _.extend(this.context, { data: this.data });
      
      ServiceView.__super__.render.call(this, ctx);
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
