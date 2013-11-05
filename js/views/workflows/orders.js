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
  // 'jquery.floatthead'
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
    additionalEvents: {
      // 'click button[data-action]': 'runAction',
      'click button[data-pagination]': 'nextPage',
      'click th[data-sort]': 'fetchSorted'
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
      if (date === undefined || date === null || date === '24h') {
        this.date = moment().add('days', -1).format(settings.DATE_DISPLAY);
      } else if (date == 'all') {
        this.date = moment(settings.DATE_FROM).format(settings.DATE_DISPLAY);
      } else if (date.match(/^[0-9]+$/)) {
        this.date = moment(date, 'YYYYMMDDHHmmss').format(settings.DATE_DISPLAY);
      } else {
        this.date = date;
      }
      
      opts.date = this.date;
      
      this.opts = opts;
      _.extend(this.options, opts);
      _.extend(this.context, opts);

      // call super method
      ListView.__super__.initialize.call(this, Collection, opts.date);
      // add element loader
      this.loader = new Qorus.Loader({ el: $('#wrap') });
      this.loader.render();
    },
    
    preRender: function () {
      var toolbar = this.setView(new OrdersToolbar(this.opts), '#toolbar');
      
      this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          context: { url: this.url },
          dispatcher: Dispatcher
      }), '#order-list');
    },
    
    onRender: function () {
      var toolbar = this.getView('#toolbar');
      toolbar.updateUrl(this.url, this.options.statuses);
      
      // init popover on info text
      $('td.info').each(function () {
        var text = '<textarea>' + $(this).text() + '</textarea>';
        $(this).popover({ content: text, title: "Info", placement: "left", container: "body", html: true});
      });
      
    },
    
    runAction: function (e) {      
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        e.stopPropagation();
        var inst = this.collection.get(data.id);
        inst.doAction(data.action); 
      }
    },
    
    updateContext: function () {
      // update actual pages
      this.context.page = {
        current_page: this.collection.page,
        has_next: this.collection.hasNextPage()
      };
      this.getView('#order-list').render();
    },
    
    // fetches the collection from server presorted by key
    fetchSorted: function (e) {
      // TODO
      var $el = $(e.currentTarget);
      var sort = $el.data('sort');
      // debug.log("Fetching sorted", sort);
      e.stopPropagation();
    },
    
    helpers: {
      action_css: context.action_css
    }
    
    // render: function (ctx) {
    //   ListView.__super__.render.call(this, ctx);
    //   // debug.log("Rendering context", this.context, this.helpers);
    // }
    
  });
  
  return ListView;
});
