define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!../../../templates/workflow/toolbars/search_toolbar.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect',
  'jquery.sticky'
], function($, _, Backbone, Qorus, Template, date, moment){
  var Toolbar = Qorus.View.extend({
    events: {
      "click button[data-action='open']": "navigateTo",
      // 'submit .form-search': 'search',
      // 'keyup .search-query': 'search'
    },
    initialize: function(opts){
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      this.template = Template;
      this.on('render', function(e, o){ $('.sticky').sticky({ el: $('.sticky').parents('.pane') }); });
    },
    
    clean: function(){
      $('.sticky').sticky('remove');
    },
    
    navigateTo: function (e) {
      var el = $(e.currentTarget);
      if (el.data('url')){
        Backbone.history.navigate(el.data('url'), {trigger: true});       
      }
    },
    search: function (e) {
      if (this.collection){
        this.collection.search(e); 
      }
      debug.log(this.options);
    }
  });
  return Toolbar;
});
