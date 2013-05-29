define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/order',
  'text!../../../templates/workflow/orders/detail.html',
  'views/steps/step',
  'rainbow.qore'
], function($, _, Qorus, Model, Template, StepView){
  var ModelView = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle',
      "click .treeview li": "toggleRow",
      "click .showstep": "stepDetail",
      "click tr.parent": "showSubSteps"
    },
    
    initialize: function (opts) {
  	  _.bindAll(this, 'render');
  	  _.bindAll(this, 'stepDetail');
      _.bindAll(this, 'getStepName');
      
      if (!_.has(opts, 'show_header'))
        opts.show_header = true;
      
      ModelView.__super__.initialize.call(this, opts);

      this.model = new Model({ id: opts.id });
      this.model.fetch();
      this.model.on('change', this.render, this);
    },
    
    render: function (ctx) {
      this.context.item = this.model;
      _.extend(this.context, { getStepName: this.getStepName }); 
      ModelView.__super__.render.call(this, ctx);
    },    

    getStepName: function (id) {
      var steps = _.filter(this.model.get('StepInstances'), function (s) {
        if (s.stepid == id)
          return s;
      });
      
      if (steps.length > 0) {
        return steps[0].stepname; 
      } else {
        return id;
      } 
    },

    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');
    },
    
    toggleRow: function(e){
      var $target = $(e.currentTarget);
      e.stopPropagation();
      $('ul', $target).toggle();
      $target.toggleClass('clps');
    },
    
    onRender: function(){
      $('li:has(li)').addClass('parent');
      
      // hide substeps and add plus sign icon
      $('.substep', this.$el).each(function () { 
        var $this = $(this);
        $this.hide();
        if ($this.prev('.parent')) {
          $('td:first-child', $this.prev('.parent')).html('<i class="icon-plus-sign"></i>');
        }
      });      
    },
    
    showSubSteps: function (e) {
      var $target = $(e.currentTarget);
      
      if($target.hasClass('parent')) {
        if ($target.hasClass('collapse')) {
          $target.nextUntil('.parent').hide();
        } else {
          $target.nextUntil('.parent').show(); 
        }
        $target.toggleClass('collapse');
        $('td:first-child i', $target).toggleClass('icon-minus-sign').toggleClass('icon-plus-sign');
      }
    },
    
    stepDetail: function(e){
      var $target = $(e.currentTarget);
    
      if ($target.data('id')) {
        e.stopPropagation();
        var sd = this.subviews.stepdetail;
        sd = new StepView({ id: $target.data('id') });
        this.assign('#stepdetail', sd);
        sd.on('render', function(){
          // console.log(JSON.stringify(sd.model));
          $('#stepdetail').modal();
          Rainbow.color();
        });
      }
    }
  });
  return ModelView;
});
