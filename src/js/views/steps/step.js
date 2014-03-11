define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/step'),
      Template = require('tpl!templates/steps/modal.html'),
      Rainbow  = require('rainbow');
  
  require('rainbow.qore');
  
  var ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle'
    },
    
    initialize: function (opts) {
      this.views = {};
      this.opts = opts;
      _.bindAll(this, 'render');
      
      this.template = Template;
      
      // init model
      this.model = new Model({ id: opts.id });
      this.listenTo(this.model, 'change', this.render);
      this.model.fetch();
      
      this.on('postrender', Rainbow.color);
    },
    
    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();
      $target.tab('show');
    },
    
    off: function () {
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    }
  });
  
  return ModelView;
});
