/*global window, console, define */
define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'collections/orders',
  'text!../../../templates/workflow/orders.html',
  'jquery.fixedheader',
  'jquery.sticky'
], function($, _, Qorus, Collection, Template){
  var ListView = Qorus.ListView.extend({
    name: 'orders',
    template: Template,
    context: {
      action_css: {
        'block': 'btn-inverse',
        'cancel': 'btn-danger',
        'retry': 'btn-success'
      }
    },
    subviews: {},
    additionalEvents: {
      'click button[data-action]': 'runAction',
      'click button[data-pagination]': 'nextPage',
      'th[data-sort]': 'fetchSorted',
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
      }
      
      _.extend(this.context, opts);
      
      this.collection = new Collection(opts);
      this.collection.on('reset', this.updateContext, this);
      this.collection.fetch();
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
      this.render();
    },
    // fetches the collection from server presorted by key
    fetchSorted: function (e) {
      var el = e.currentTarget;
      var sort = el.data('sort');
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
      this.$el.parent('.pane').scroll(this.scroll);
      $('.table-fixed').fixedHeader({ topOffset: 80, el: $('.table-fixed').parents('.pane') });
    },
    hello: function(e) {
      e.stopPropagation();
      // e.preventDefault();
      console.log("tutudu", e.currentTarget);
    }
  });
  return ListView;
});
