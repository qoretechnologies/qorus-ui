define(function (require) {
  var $          = require('jquery'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Collection = require('collections/results'),
      Template   = require('tpl!templates/job/results/list.html'),
      TableTpl   = require('text!templates/job/results/table.html'),
      RowTpl     = require('text!templates/job/results/row.html'),
      Toolbar    = require('views/toolbars/results_toolbar'), 
      moment     = require('moment'),
      settings   = require('settings'),
      ListView;


  ListView = Qorus.ListView.extend({
    template: Template,
    model_name: 'result',
    additionalEvents: {
      'click th[data-sort]': 'fetchSorted'
    },
    
    initialize: function (opts) {
      this.options = {};
      this.context = {};
      this.helpers = {};
      
      opts = opts || {};
      
      // if (opts.url) {
      //   this.url = [opts.url, this.name].join('/');
      //   opts.url = this.url;
      //   // delete opts.url;
      // }

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

      ListView.__super__.initialize.call(this, Collection, this.date, this.options);
    },

    onRender: function () {
      if (this.collection.length > 0) {
        this.$el.parent('.pane').scroll(this.scroll);
        // $('.table-fixed').fixedHeader({ topOffset: 80, el: $('.table-fixed').parents('.pane') });
        $('.pane').scroll(this.scroll);
      }
    },

    preRender: function () {
      this.setView(new Qorus.TableView({
        collection: this.collection, 
        template: TableTpl,
        row_template: RowTpl,
        helpers: this.helpers,
        context: { url: this.url },
        dispatcher: Dispatcher
      }), '#result-list');

      this.setView(new Toolbar({ date: this.date, url: this.opts.url, statuses: this.opts.statuses }), '#toolbar');
    },
    
    updateContext: function () {
      // update actual pages
      this.context.page = {
        current_page: this.collection.page,
        has_next: this.collection.hasNextPage()
      };
      // this.subviews.table.render();
      this.getView('#result-list').render();
    },
    
    scroll: function () {
      var pos = this.$el.height() + this.$el.offset().top - $(window).height();
      if (pos < 100) {
        this.nextPage(); 
        this.$el.children('button[data-pagination]').html("Loading...");
      }
    },
    
    fetchSorted: function () {  }
  }); 

  return ListView;
});
