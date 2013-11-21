define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/result',
  'text!templates/job/results/detail.html',
  'rainbow.qore'
], function($, _, Qorus, Model, Template, StepView){
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
      // this.listenTo(this.model, 'change', this.render, this);
      this.model.fetch();
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
      this.context.item = this.model.toJSON();
      ModelView.__super__.render.call(this, ctx);
    },
    
    onRender: function () {
      // init popover on info text
      console.log(this.$el);
      $('td.info').each(function () {
        var text = '<textarea>' + $(this).text() + '</textarea>';
        $(this).popover({ content: text, title: "Info", placement: "left", container: "#errors", html: true});
      });
    }
  });
  return ModelView;
});
