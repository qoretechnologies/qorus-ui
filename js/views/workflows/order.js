define(function(require) {
  var $            = require('jquery'),
      _            = require('underscore'),
      Qorus        = require('qorus/qorus'),
      Model        = require('models/order'),
      Workflow     = require('models/workflow'),
      Template     = require('text!templates/workflow/orders/detail.html'),
      StepView     = require('views/steps/step'),
      DiagramView  = require('views/common/diagram'),
      context, ModelView;
      
  context = {
    action_css: {
      'block': 'btn-inverse',
      'cancel': 'btn-danger',
      'retry': 'btn-success'
    }
  };
  
  ModelView = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle',
      "click .treeview li": "toggleRow",
      "click .showstep": "stepDetail",
      "click tr.parent": "showSubSteps",
      "click td.info": "showInfo",
      'click button[data-action]': 'runAction',
      "click .copy-paste": 'enableCopyMode',
      "click .tree-caret": 'toggleTree'
    },
    
    initialize: function (opts) {
  	  _.bindAll(this);
      
      if (!_.has(opts, 'show_header'))
        opts.show_header = true;
      
      ModelView.__super__.initialize.call(this, opts);

      this.model = new Model({ id: opts.id });
      this.listenTo(this.model, 'change', this.render, this);
      this.model.fetch();
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
      var self = this,
        dia,
        wfl = new Workflow({ id: this.model.get('workflowid') });
      
      self.listenTo(wfl, 'sync', function () {
        self.setview(new DiagramView({ steps: wfl.mapSteps() }), '#steps-diagram', true);
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
      debug.log('run action stop propagation');
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
      var $target = $(e.currentTarget),
        id = $target.data('id');
    
      if (id) {
        e.stopPropagation();
        this.setView(new StepView({ id: id }), '#stepdetail', true);
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
    
    toggleTree: function (e) {
      var $el = $(e.currentTarget),
        branch = $el.data('branch-id');
        
        debug.log($el.data);
      $el.children('i')
        .toggleClass('icon-caret-down')
        .toggleClass('icon-caret-right');
        
      this.$('[data-tree-id*='+ branch +'-]').toggle();
      debug.log('[data-tree-id*='+ branch +'-]', this.$('[data-tree-id*='+ branch +'-]'));

      e.preventDefault();
      e.stopPropagation();
    },
    
    helpers: {
      action_css: context.action_css
    }
    
  });
  return ModelView;
});
