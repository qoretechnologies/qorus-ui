define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/order',
  'models/workflow',
  'text!../../../templates/workflow/orders/detail.html',
  'views/steps/step',
  'views/common/diagram'
], function($, _, Qorus, Model, Workflow, Template, StepView, DiagramView){
  var context = {
    action_css: {
      'block': 'btn-inverse',
      'cancel': 'btn-danger',
      'retry': 'btn-success'
    }
  };
  
  var ModelView = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle',
      "click .treeview li": "toggleRow",
      "click .showstep": "stepDetail",
      "click tr.parent": "showSubSteps",
      "click td.info": "showInfo",
      'click button[data-action]': 'runAction',
      "click .copy-paste": 'enableCopyMode'
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
      
      // init popover on info text
      $('td.info').each(function () {
        var text = '<textarea>' + $(this).text() + '</textarea>';
        $(this).popover({ content: text, title: "Info", placement: "left", container: "#errors", html: true});
      });
      
      // this.createDiagram();
    },
    
    createDiagram: function () {
      var _this = this;
      var dia;
      if (this.subviews.step_diagram) {
        this.subviews.step_diagram.off();
      }
      
      var wfl = new Workflow({ id: this.model.get('workflowid') });
      wfl.on('sync', function () {
        dia = _this.subviews.step_diagram = new DiagramView({ steps: wfl.mapSteps() });
        console.log(dia.render());
        _this.assign('#steps-diagram', dia);
      });
      
      wfl.fetch();
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
    
    runAction: function (e) {
      console.log('run action stop propagation');
      e.stopPropagation();
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        var inst = this.model;
        inst.doAction(data.action); 
      }
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
    
    stepDetail: function(e) {
      var $target = $(e.currentTarget);
    
      if ($target.data('id')) {
        e.stopPropagation();
        var sd = this.subviews.stepdetail;
        sd = new StepView({ id: $target.data('id') });
        this.assign('#stepdetail', sd);        
      }
    },
    
    enableCopyMode: function (e) {
      var $el = $(e.currentTarget);
      var $parent = $el.parent();
      
      $('.treeview', $parent).toggle();
      $('.textview', $parent).toggle();
      $el.toggleClass('on');
      $el.text($el.hasClass('on') ? $el.data('msg-on') : $el.data('msg-off'));
      e.preventDefault();
    },
    
    helpers: {
      action_css: context.action_css
    }
    
  });
  return ModelView;
});
