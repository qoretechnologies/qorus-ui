define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/results',
  'text!templates/job/results/list.html',
  'text!templates/job/results/table.html',
  'text!templates/job/results/row.html',
  'views/toolbars/results_toolbar'
], function ($, _, Qorus, Dispatcher, Collection, Template, TableTpl, RowTpl, Toolbar) {

  var ListView = Qorus.ListView.extend({
    template: Template,
    model_name: 'result',
    additionalEvents: {
      'click th[data-sort]': 'fetchSorted',
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      
      this.opts = opts || {};

      ListView.__super__.initialize.call(this, Collection, this.opts.date);
      // _.extend(this.options, opts);
      // _.extend(this.context, opts);

      this.opts.url = '/jobs/view/' + opts.jobid;

      // this.collection = new Collection(opts);
      // this.listenTo(this.collection, 'sync', this.updateContext, this);
      // this.collection.fetch();
      
      this.render();
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
      
      this.setView(new Toolbar({ date: this.date, url: this.opts.url }), '#toolbar');
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
    
    fetchSorted: function (e) {
      var $target = $(e.currentTarget);
      var sort = $target.data('sort');
    }
  }); 

  return ListView;
});