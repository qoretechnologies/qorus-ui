define(function(require) {
  var $         = require('jquery'),
      _         = require('underscore'),
      Qorus     = require('qorus/qorus'),
      Model     = require('models/result'),
      Template  = require('text!templates/job/results/detail.html'),
      StepView  = require('views/steps/step'),
      rainbow   = require('rainbow.qore'),
      context   = {},
      ModelView;
  
  ModelView = Qorus.TabView.extend({
    template: Template,
    
    initialize: function (opts) {
  	  _.bindAll(this);
            
      ModelView.__super__.initialize.call(this, opts);

      this.model = new Model({ id: opts.id });
      // this.listenTo(this.model, 'change', this.render, this);
      this.model.fetch();
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
      // console.log(this.$el);
      $('td.info').each(function () {
        var text = '<textarea>' + $(this).text() + '</textarea>';
        $(this).popover({ content: text, title: "Info", placement: "left", container: "#errors", html: true});
      });
    }
  });
  return ModelView;
});
