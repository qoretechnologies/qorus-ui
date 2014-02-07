define(function (require) {
  require('bootstrap.multiselect');
  require('jquery.sticky');
  
  var $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/workflow/toolbars/search_toolbar.hrml'),
      Toolbar;
  
  Toolbar = Qorus.View.extend({
    events: {
      "click button[data-action='open']": "navigateTo"
      // 'submit .form-search': 'search',
      // 'keyup .search-query': 'search'
    },
    initialize: function(opts){
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      this.template = Template;
    },
    
    onRender: function () {
       this.sticky = this.$('.sticky').sticky({ el: this.$('.sticky').parents('.pane') });
    },
    
    clean: function(){
      if (this.sticky) {
        this.$('.sticky').sticky('remove');
        this.sticky.remove();
      }
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
