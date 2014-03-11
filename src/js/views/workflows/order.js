define(function(require) {
  var $               = require('jquery'),
      _               = require('underscore'),
      helpers         = require('qorus/helpers'),
      Qorus           = require('qorus/qorus'),
      Model           = require('models/order'),
      Workflow        = require('models/workflow'),
      Template        = require('text!templates/workflow/orders/detail.html'),
      ModalView       = require('views/common/modal'),
      StepView        = require('views/steps/step'),
      DiagramBaseView = require('views/common/diagram'),
      DiagramTpl      = require('tpl!templates/common/order_diagram.html'),
      StepsTpl        = require('tpl!templates/workflow/orders/steps.html'),
      DataTpl         = require('tpl!templates/workflow/orders/data.html'),
      ErrorsTpl       = require('tpl!templates/workflow/orders/errors.html'),
      HierarchyTpl    = require('tpl!templates/workflow/orders/hierarchy.html'),
      AuditTpl        = require('tpl!templates/workflow/orders/audit.html'),
      InfoTpl         = require('tpl!templates/workflow/orders/info.html'),
      AlertsTpl       = require('tpl!templates/common/alerts.html'),
      context, ModelView, StepsView, ErrorsView;
      
  context = {
    action_css: {
      'block': 'btn-inverse',
      'cancel': 'btn-danger',
      'retry': 'btn-success'
    }
  };
  
  DiagramView = DiagramBaseView.extend({
    template: DiagramTpl,
    additionalEvents: {
      "click .box": 'stepDetail'
    },
    
    initialize: function (options) {
      DiagramView.__super__.initialize.apply(this, arguments);
      this.order_model = options.model;
      
      this.model = new Workflow({ workflowid: options.id });
      this.model.fetch();
      this.listenTo(this.model, 'sync', this.render);
    },
    
    preRender: function () {
      this.context.steps = this.model.mapSteps();
      this.context.order = this.order_model.toJSON();
    },
    
    onRender: function () {
      this.fixCanvas();
      $(window).on('resize.canvas', this.fixCanvas);
    },
    
    render: function () {
      if (this.model.isNew()) return;
      DiagramView.__super__.render.apply(this, arguments);
    },
    
    stepDetail: function (e) {
      var $target = $(e.currentTarget),
        id = $target.data('id');
    
      if (id) {
        e.preventDefault();
        e.stopPropagation();
        this.insertView(new ModalView({
          content_view: new StepView({ id: id }) 
        }), '#stepdetail');
      }
    },
    
    clean: function () {
      $(window).off('resize.canvas', this.fixCanvas);
    }
  });
  
  StepsView = Qorus.ModelView.extend({
    name: 'Steps',
    template: StepsTpl,
    preRender: function () {
      StepsView.__super__.preRender.apply(this, arguments);
      
      this.setView(new DiagramView({ id: this.model.get('workflowid'), model: this.model }), '#steps-diagram');
      _.extend(this.context, { getStepName: this.getStepName });
    },
    onRender: function () {
      this.$('li:has(li)').addClass('parent');
      
      // hide substeps and add plus sign icon
      this.$('.substep').each(function () { 
        var $this = $(this);
        $this.hide();
        if ($this.prev('.parent')) {
          $('td:first-child', $this.prev('.parent')).html('<i class="icon-plus-sign"></i>');
        }
      });
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
  });
  
  ErrorsView = Qorus.ModelView.extend({
    onRender: function () {
      // init popover on info text
      this.$('td.info').each(function () {
        var text = '<textarea>' + $(this).text() + '</textarea>';
        $(this).popover({ content: text, title: "Info", placement: "left", container: "#errors", html: true});
      });
    }
  });
  
  
  ModelView = Qorus.TabView.extend({
    __name__: "OrderView",
    template: Template,
    additionalEvents: {
      "click .treeview li": "toggleRow",
      "click .showstep": "stepDetail",
      "click tr.parent": "showSubSteps",
      'click button[data-action]': 'runAction',
      "click .copy-paste": 'enableCopyMode',
      "click .tree-caret": 'toggleTree'
    },
    
    url: function () {
      return helpers.getUrl('showOrder', { id: this.model.id });
    },
    
    initialize: function (opts) {
      ModelView.__super__.initialize.apply(this, arguments);
      
      if (!_.has(opts, 'show_header'))
        this.options.show_header = true;

      this.model = new Model({ id: opts.id });
      this.listenTo(this.model, 'change', this.render, this);
      this.model.fetch();
    },
    
    preRender: function () {
      this.removeView('tabs');
      
      this.addTabView(new StepsView({ model: this.model }));
      this.addTabView(new Qorus.ModelView({ model: this.model, template: DataTpl }), { name: 'Data'});
      this.addTabView(new ErrorsView({ model: this.model, template: ErrorsTpl }), { name: 'Errors'});
      this.addTabView(new Qorus.ModelView({ model: this.model, template: HierarchyTpl }), { name: 'Hierarchy'});
      this.addTabView(new Qorus.ModelView({ model: this.model, template: AuditTpl }), { name: 'Audit Events'});
      this.addTabView(new Qorus.ModelView({ model: this.model, template: InfoTpl }), { name: 'Info'});
      
      if (this.model.get('has_alerts'))
        this.addTabView(new AlertsView({ model: this.model, template: AlertsTpl }), { name: 'Alerts'});
        
      _.extend(this.context, { 
        item: this.model.toJSON(),
        show_header: this.options.show_header,
        getStepName: this.getStepName, 
        action_css: context.action_css 
      }); 
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
        this.insertView(new ModalView({
          content_view: new StepView({ id: id }) 
        }), '#stepdetail');
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
