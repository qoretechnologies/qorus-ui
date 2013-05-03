define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/order',
  'text!../../../templates/workflow/orders/detail.html',
  'views/steps/function',
  'rainbow.qore'
], function($, _, Qorus, Model, Template, FunctionView){
  var ModelView = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle',
      "click .treeview li": "toggleRow",
      "click .showstep": 'stepDetail',
    },
    
    initialize: function (opts) {
      ModelView.__super__.initialize.call(this, opts);
  	  _.bindAll(this, 'render');
  	  _.bindAll(this, 'stepDetail');
      this.model = new Model({ id: opts.id });
      this.model.fetch();
      this.model.on('change', this.render, this);
    },
    
    render: function (ctx) {
      this.context.item = this.model;
      var _this = this;
      var getStepName = function (id) {
        var steps = _.filter(_this.model.get('StepInstances'), function (s) {
          if (s.stepid == id)
            return s;
        });
        console.log("steps", steps);
        return steps[0].stepname;
      }
      _.extend(this.context, { getStepName: getStepName }); 
      ModelView.__super__.render.call(this, ctx);
      this.onRender();
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
    },
    
    stepDetail: function(e){
      var $target = $(e.currentTarget);
      e.stopPropagation();

      console.log('Clicked Stepname', e);
      console.log('Step ID', $target.data('id'));      
      if ($target.data('id')) {
        var sd = this.subviews.stepdetail;
        sd = new FunctionView({ id: $target.data('id') });
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
