define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/orders',
  'views/toolbars/orders_toolbar',
  'text!../../../templates/workflow/orders.html',
  'text!../../../templates/workflow/orders/table.html',
  'text!../../../templates/workflow/orders/row.html',
  'jquery.fixedheader',
  'jquery.sticky'
], function($, _, Qorus, Dispatcher, Collection, OrdersToolbar, Template, TableTpl, RowTpl){
  var context = {
    action_css: {
      'block': 'btn-inverse',
      'cancel': 'btn-danger',
      'retry': 'btn-success'
    }
  };
  
  var ListView = Qorus.ListView.extend({
    name: 'orders',
    template: Template,
    context: context,
    subviews: {},
    additionalEvents: {
      'click button[data-action]': 'runAction',
      'click button[data-pagination]': 'nextPage',
      'click th[data-sort]': 'fetchSorted',
      'scroll': 'scroll'
    },
    
    initialize: function (opts) {
      opts = opts || {};
      _.bindAll(this);
      
      if (opts.url) {
        this.url = [opts.url, this.name].join('/');
        opts.url = this.url;
        // delete opts.url;
      }
      
      if (opts.date) {
        this.date = opts.date;
      } else {
        opts.date = this.date;
      }
      
      this.opts = opts;
      _.extend(this.options, opts);
      _.extend(this.context, opts);

      this.collection = new Collection(this.opts);
      this.collection.on('sync', this.updateContext, this);
      this.collection.fetch();

      this.createSubviews();
    },
    
    createSubviews: function () {
      this.subviews.table = new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          context: { url: this.url },
          dispatcher: Dispatcher
      });

      // this should be placed inside instances/orders view
      console.log("Orders options", this.options, this.opts, this.date);
      this.subviews.toolbar = new OrdersToolbar(_.extend(this.options, { date: this.date }));
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
    
    updateContext: function () {
      // update actual pages
      this.context.page = {
        current_page: this.collection.page,
        has_next: this.collection.hasNextPage()
      };
      this.subviews.table.render();
    },
    
    // fetches the collection from server presorted by key
    fetchSorted: function (e) {
      // TODO
      var $el = $(e.currentTarget);
      var sort = $el.data('sort');
      console.log("Fetching sorted", sort);
      e.stopPropagation();
    },
    
    scroll: function () {
      var pos = this.$el.height() + this.$el.offset().top - $(window).height();
      if (pos < 100) {
        this.nextPage(); 
        this.$el.children('button[data-pagination]').html("Loading...");
      }
    },
    
    onRender: function () {
      this.subviews.toolbar.updateUrl(this.url, this.options.statuses);
      this.assign('#toolbar', this.subviews.toolbar);
      
      if (this.collection.length > 0) {
        this.assign('#order-list', this.subviews.table);
        this.$el.parent('.pane').scroll(this.scroll);
        $('.table-fixed').fixedHeader({ topOffset: 80, el: $('.table-fixed').parents('.pane') });
        $('.pane').scroll(this.scroll);
      }
    },
    
    helpers: {
      action_css: context.action_css
    },
    
    render: function (ctx) {
      ListView.__super__.render.call(this, ctx);
      console.log("Rendering context", this.context, this.helpers);
    }
    
  });
  
  return ListView;
});
