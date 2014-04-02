define(function(require, exports, module) {
  var $               = require('jquery'),
      _               = require('underscore'),
      helpers         = require('qorus/helpers'),
      Qorus           = require('qorus/qorus'),
      Model           = require('models/order'),
      StepModel       = require('models/step'),
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
      DiagramPaneTpl  = require('tpl!templates/workflow/orders/diagram.html'),
      StepInfoTpl     = require('tpl!templates/workflow/orders/stepinfo.html'),
      StepErrorsTpl   = require('tpl!templates/workflow/orders/steperrors.html'),
      SystemSettings  = require('models/settings'),
      context, ModelView, StepsView, ErrorsView, DiagramPaneView, 
      DiagramView, StepInfoView, StepErrorsView;
  
  require('jquery.ui');
  require('bootstrap');
      
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
      "click .box[data-action='show-dd']": 'showDropdown',
      "contextmenu .box": 'stepDetail'
    },
    
    initialize: function (options) {
      DiagramView.__super__.initialize.apply(this, arguments);
      this.order_model = options.model;
      
      this.model = new Workflow({ workflowid: options.model.get('workflowid') });
      this.listenTo(this.model, 'sync', this.render);
      this.model.fetch();
    },
    
    preRender: function () {
      // alter instances to have name hash with stepname
      var instances = _(this.order_model.get('StepInstances')).map(function (inst) {
        inst.name = inst.stepname;
        return inst;
      });
      
      this.context.steps = this.model.prepareSteps(
        this.model.get('name'),
        this.model.get('steps'), 
        this.model.get('stepmap'),
        instances
      );

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
    
    showDropdown: function (e) {
      var tpl = "<div class='dropdown open'><ul class='dropdown-menu' role='menu'><% _.each(obj.steps, function (step) { %><li><a data-id='<%= step.stepid %>'" 
        + " data-action='show-detail'><%= step.ind %> - <%= step.stepstatus %></a></li> <% }) %></ul></div>";
      var $target = $(e.currentTarget);
      var stepname = this.order_model.getStepName($target.data('id'));
      var step = _(this.order_model.get('StepInstances')).where({ stepname: stepname });
      
      this.hideDropdown();
      
      e.preventDefault();
      if (step.length <= 1) return;

      var $dd = $(_.template(tpl, { steps: step }));      
      $dd
        .css('top', $target.offset().top)
        .css('left', $target.position().left)
        .css('position', 'absolute');
      this.$el.append($dd);
    },
    
    hideDropdown: function () {
      this.$('.dropdown').remove();
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
    }
  });
  
  ErrorsView = Qorus.ModelView.extend({
    onRender: function () {
      // init popover on info text
      this.$('td.info').each(function () {
        var text = '<textarea>' + $(this).text() + '</textarea>';
        $(this).popover({ content: text, title: "Info", placement: "left", container: '#errors', html: true});
      });
    }
  });
  
  // View showing step info which is used within DiagramView
  StepInfoView = Qorus.View.extend({
    initialize: function (options) {
      StepInfoView.__super__.initialize.apply(this, arguments);
      this.model = new StepModel({ stepid: options.stepid });
      this.listenTo(this.model, 'sync', this.render);
      this.model.fetch();
    },
    
    preRender: function () {
      this.context.model = this.model.toJSON();
    },
    
    off: function () {
      if (this.clean) this.clean();
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    }
  });
  
  // View showing step associated errors
  StepErrorsView = Qorus.View.extend({
    __name__: 'StepErrorsView',
    onRender: function () {
      // init popover on info text
      this.$('td.info').each(function () {
        var text = '<textarea>' + $(this).text() + '</textarea>';
        $(this).popover({ content: text, title: "Info", placement: "left", container: "#diagram", html: true});
      });
      this.wrap();
    },
    
    off: function () {
      if (this.clean) this.clean();
      if (this.$fixed_pane) {
        this.$fixed_pane.resizable('destroy');
        this.$fixed_pane = null;
      }
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    },
    
    /* wraps view element to make it fixed position and resizable */
    wrap: function () {
      var $divw           = $('<div class="fixed-pane-wrapper" />'),
          $div            = $('<div class="fixed-pane" />'),
          $div_inner      = $('<div class="fixed-pane-inner" />'),
          $push           = $('<div class="fixed-pane-push push"/>'),
          height_settings = [module.id.replace(/\//g, '.'), this.__name__, 'height'].join('.'),
          height,
          $fixed_pane;
      
      $div
        .addClass('fixed-pane-bottom');
        
      // add parent pusher      
      this.$el.parent().append($push);
      
      // wrap the view element
      this.$el.wrap($divw).wrap($div).wrap($div_inner);
      
      $fixed_pane = this.$el.parents('.fixed-pane');
      
      // get stored height
      var height = SystemSettings.get(height_settings);
      if (height) $fixed_pane.height(height);
      
      // change push height according to pane height
      $push.height($fixed_pane.outerHeight(true));

      // resizable
      $fixed_pane.resizable({
        handles: 'n',
        maxHeight: $(window).height() - 200,
        minHeight: 150
      });
      
      this.$fixed_pane = $fixed_pane;
      $fixed_pane.on('resize', function (e, ui) {
        var $el = ui.element;
        $el.parent().next().height(ui.size.height);
      });
      $fixed_pane.on('resizestop', $.proxy(function (event, ui) {
        SystemSettings.set(height_settings, ui.size.height);
        SystemSettings.save();
      }, this));
    }
  });
  
  // Diagram tab view
  DiagramPaneView = Qorus.ModelView.extend({
    additionalEvents: {
      "click #step-diagram .box.start": 'showAllErrors',
      "click #step-diagram .box[data-action='show-detail']": 'showDetail',
      "click #step-diagram a[data-action='show-detail']": 'showDetail'
    },
    
    name: 'Diagram',
    template: DiagramPaneTpl,
    preRender: function () {      
      this.setView(new DiagramView({ model: this.model }), '#step-diagram');
      this.showAllErrors();
    },
    
    showAllErrors: function (e) {
      this.setView(new StepErrorsView({ errors: this.model.get('ErrorInstances'), template: StepErrorsTpl}), '#step-errors', true).render();
      if (e) {
       e.preventDefault(); 
      }
    },
    
    showDetail: function (e) {
      var $target = $(e.currentTarget),
          stepid  = $target.data('id'),
          instances = this.model.get('StepInstances'),
          step, errors;
      
      e.preventDefault();
      
      // exit when click is made on diagram start - no step detail available
      if ($target.hasClass('start')) return;
      
      step   = _.findWhere(instances, { stepid: stepid });
      errors = _.where(this.model.get('ErrorInstances'), { stepid: stepid });
      
      this.setView(new StepInfoView({ item: step, stepid: stepid, template: StepInfoTpl }), '#step-detail', true);
      this.setView(new StepErrorsView({ errors: errors, template: StepErrorsTpl}), '#step-errors', true).render();
      
      // box selected styling
      this.$('.box').removeClass('selected');
      $target.addClass('selected');
      this.getView('#step-diagram').hideDropdown();
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

      this.model = new Model({ workflow_instanceid: opts.id });
      this.listenTo(this.model, 'change', this.render);
      this.model.fetch();
    },
    
    preRender: function () {
      this.removeView('tabs');
      
      this.addTabView(new DiagramPaneView({ model: this.model }));
      this.addTabView(new StepsView({ model: this.model }));
      this.addTabView(new Qorus.ModelView({ model: this.model, template: DataTpl }), { name: 'Data'});
      this.addTabView(new ErrorsView({ model: this.model, template: ErrorsTpl }), { name: 'Errors'});
      this.addTabView(new Qorus.ModelView({ model: this.model, template: HierarchyTpl }), { name: 'Hierarchy'});
      this.addTabView(new Qorus.ModelView({ model: this.model, template: AuditTpl }), { name: 'Audit Events'});
      this.addTabView(new Qorus.ModelView({ model: this.model, template: InfoTpl }), { name: 'Info'});
      
      if (this.model.get('has_alerts'))
        this.addTabView(new Qorus.ModelView({ model: this.model, template: AlertsTpl }), { name: 'Alerts'});
        
      _.extend(this.context, { 
        item: this.model.toJSON(),
        show_header: this.options.show_header,
        getStepName: this.getStepName, 
        action_css: context.action_css 
      });
      console.log(this.$el, this.context);
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
