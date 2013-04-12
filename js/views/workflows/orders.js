/*global window, console, define */
define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'collections/orders',
  'text!../../../templates/workflow/orders.html'
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
      'scroll': 'scroll'
    },
    initialize: function(opts){
      _.bindAll(this);
      _.extend(this.context, opts);
      
      if (opts.url){
        this.url = opts.url + '/' + this.name;
        opts.url = this.url;
      }
      
      delete opts.url;

      this.collection = new Collection(opts);
      this.collection.on('reset', this.updateContext, this);
      this.collection.fetch();
    },
    runAction: function(e){
      e.stopPropagation();
      var data = e.currentTarget.dataset;
      if (data.id && data.action){
        var inst = this.collection.get(data.id);
        inst.doAction(data.action); 
      }
    },
    nextPage: function(){
      this.collection.loadNextPage();
    },
    updateContext: function(){
      // update actual pages
      console.log(this);
      this.context.page = {
        current_page: this.collection.page,
        has_next: this.collection.hasNextPage()
      };
      this.render();
    },
    scroll: function(){
      var pos = this.$el.height() + this.$el.offset().top - $(window).height();
      if(pos < 100){
        this.nextPage(); 
        this.$el.children('button[data-pagination]').html("Loading...");
      }
    },
    render: function(){
      ListView.__super__.render.call(this);
      this.onRender();
      return this;
    },
    onRender: function(){
      this.$el.parent('.pane').scroll(this.scroll);
    }
  });
  return ListView;
});
