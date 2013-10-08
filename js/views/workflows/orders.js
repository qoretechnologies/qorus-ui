define([
  'jquery',
  'underscore',
  'settings',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/orders',
  'views/toolbars/orders_toolbar',
  'text!../../../templates/workflow/orders.html',
  'text!../../../templates/workflow/orders/table.html',
  'text!../../../templates/workflow/orders/row.html',
  'jquery.fixedheader',
  'jquery.sticky'
], function($, _, settings, Qorus, Dispatcher, Collection, OrdersToolbar, Template, TableTpl, RowTpl){
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
      // 'click button[data-action]': 'runAction',
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


      // set DATE format and init date
      var date = opts.date;
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
      
      opts.date = this.date;
      
      this.opts = opts;
      _.extend(this.options, opts);
      _.extend(this.context, opts);

      // call super method
      // ListView.__super__.initialize.call(this, Collection, opts.date);
      // add element loader
      this.loader = new Qorus.Loader({ el: $('#wrap') });
      this.loader.render();

      this.collection = new Collection(this.opts);
      this.listenTo(this.collection, 'sync', this.updateContext, this);
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
      this.subviews.toolbar = new OrdersToolbar(this.options);
    },
    
    runAction: function (e) {      
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        e.stopPropagation();
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
      // console.log("Fetching sorted", sort);
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
      
      // init popover on info text
      $('td.info').each(function () {
        var text = '<textarea>' + $(this).text() + '</textarea>';
        $(this).popover({ content: text, title: "Info", placement: "left", container: "body", html: true});
      });
    },
    
    helpers: {
      action_css: context.action_css
    }
    
    // render: function (ctx) {
    //   ListView.__super__.render.call(this, ctx);
    //   // console.log("Rendering context", this.context, this.helpers);
    // }
    
  });
  
  return ListView;
});
