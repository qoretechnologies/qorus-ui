define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/helpers',
  'models/result',
  'text!../../../templates/job/results/detail.html',
  'rainbow.qore'
], function($, _, Qorus, Helpers, Model, Template, StepView){
  var context = {};
  
  var ModelView = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle'
    },
    
    initialize: function (opts) {
  	  _.bindAll(this);
            
      ModelView.__super__.initialize.call(this, opts);

      this.model = new Model({ id: opts.id });
      this.model.fetch();
      this.model.on('change', this.render, this);
    },

    tabToggle: function(e){
      var $target = $(e.currentTarget);
      // e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');
    },
    
    toggleRow: function(e){
      var $target = $(e.currentTarget);
      e.stopPropagation();
      $('ul', $target).toggle();
      $target.toggleClass('clps');
    },
    
    render: function (ctx) {
      this.context.item = this.model;
      ModelView.__super__.render.call(this, ctx);
    }
        
  });
  return ModelView;
});
