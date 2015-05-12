define(function(require) {
  var $               = require('jquery'),
      settings        = require('settings'),
      _               = require('underscore'),
      moment          = require('moment'),
      utils           = require('utils'),
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
      NotesTpl        = require('tpl!templates/workflow/orders/notes.html'),
      NotesListTpl    = require('tpl!templates/workflow/orders/noteslist.html'),
      datepicker      = require('views/common/datetimepicker'),
      LockTemplate    = require('tpl!templates/workflow/orders/lock.html'),
      User            = require('models/system').User,
      ConfirmView     = require('views/common/confirm'),
      StatusTpl       = require('tpl!templates/workflow/orders/status.html'),
      StepErrorsView  = require('views/workflows/orders/steperrors'),
      ToolbarTpl      = require('tpl!templates/workflow/orders/toolbar.html'),
      CopyView        = require('views/common/table.copy'),
      context, ModelView, StepsView, ErrorsView, DiagramPaneView, 
      DiagramView, DataView, StepInfoView, NotesView, OrderLockView,
      WorkflowStatus, Toolbar;
  
  require('jquery-ui');
  require('bootstrap');
  require('jquery.expanding');
      
  context = {
    action_css: {
      'block': 'btn-inverse',
      'cancel': 'btn-danger',
      'retry': 'btn-success'
    }
  };
  
  Toolbar = Qorus.ModelView.extend({
    template: ToolbarTpl,
    postInit: function () {
      this.listenTo(this.model, 'change', this.render);
      this.context.action_css = context.action_css;
    }
  });
  
  WorkflowStatus = Qorus.ModelView.extend({
    template: StatusTpl,
    initialize: function () {
      WorkflowStatus.__super__.initialize.apply(this, arguments);
      this.listenTo(this.model, 'sync', this.render);
    }
  });
  
  OrderLockView = Qorus.ModelView.extend({
    template: LockTemplate,
    additionalEvents: {
      "submit": "lockOrder",
      "click button[type=submit]": "lockOrder"
    },
        
    lockOrder: function () {
      var note = this.$('textarea[name=note]').val();
      this.model.doAction(this.options.action, { note: note });
      this.trigger('close');
    }
  });

  
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
      return this;
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
      var tpl      = "<div class='dropdown open'><ul class='dropdown-menu' role='menu'><% _.each(obj.steps, function (step) { %><li><a data-id='<%= step.stepid %>'" + 
                     " data-action = 'show-detail'><%= step.ind %> - <%= step.stepstatus %></a></li> <% }) %></ul></div>",
          $target  = $(e.currentTarget),
          stepname = this.order_model.getStepName($target.data('id')),
          step     = _(this.order_model.get('StepInstances')).where({ stepname: stepname });
      
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
    postInit: function () {
      this.listenTo(this.model, 'sync', this.render);
    },
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
    postInit: function () {
      this.listenTo(this.model, 'sync', this.render);
      this.setView(new CopyView({ csv_options:  { el: '#errors table' }, css_class: 'btn-mini' }), '.table-copy');
    },
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
    
    close: function () {
      if (this.clean) this.clean();
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    }
  });
  
  DataView = Qorus.ModelView.extend({
    template: DataTpl,
    additionalEvents: {
      'click .nav-pills a': 'tabToggle',
      'submit': 'submitExternalData',
    },
    tabToggle: function (e) {
      var $target = $(e.currentTarget);
      
      $target.tab('show');
      this.activeTab = $target.data('target');
      e.preventDefault();
      e.stopPropagation();
    },
    postInit: function () {
      this.listenTo(this.model, 'sync', this.render);
    },
    preRender: function () {
      this.context.staticdata = utils.flattenObj(this.model.get('staticdata'));
      this.context.dynamicdata = utils.flattenObj(this.model.get('dynamicdata'));
      this.context.keys = utils.flattenObj(this.model.get('keys'));
    },
    onRender: function () {
        if (this.activeTab) {
            this.$('[data-target="'+this.activeTab+'"]').tab('show');
        }
    },
    submitExternalData: function (e) {
      e.preventDefault();
      if (e.type === 'submit') {
        var $target = $(e.target);

        try {
          var data = JSON.parse(_.pluck($target.serializeArray(), 'value')[0]);
          var opts = { "newdata" : data };
          this.model.doAction($target.attr('id'), opts, function(status, response) {
              this.showResponse(status, response, $target);
              if (status) {
                  this.model.set($target.attr('id').toLowerCase(), data);
                  this.render();
              }
              }.bind(this));
          this.showResponse(true, 'Updated', $target);
        }
        catch (ex) {
          this.showResponse(false, ex, $target);
        }
      }
    },
    showResponse: function (status, response, $target) {
        $('.alert', $target).removeClass().addClass('alert alert-' + (status ? 'success' : 'error'));

        if (response.responseJSON) {
            $('.alert', $target).html('<b>' + response.responseJSON.err + '</b>: ' + response.responseJSON.desc);
        }
        else {
            $('.alert', $target).html(response);
        }
    }
  });
  
  
  NotesView = Qorus.ModelView.extend({
    template: NotesTpl,
    additionalEvents: {
      // "submit": "addNote",
      "keypress textarea.note": "addNote",
      "focus textarea.note": "expand",
      "submit form": "addNote"
    },
    initialize: function () {
      NotesView.__super__.initialize.apply(this, arguments);
      var notes = this.setView(new Qorus.View({ model: this.model, template: NotesListTpl }), '#notes-list');
      notes.listenTo(this.model, 'update:notes', notes.render);
    },
    
    clean: function () {
      this.$('textarea').expanding('destroy');
      return this;
    },
    
    expand: function () {
      if (this.$('textarea').expanding('active')) return this;

      this.$('textarea').expanding();
      this.$('textarea').focus();
    },
    
    addNote: function (e) {
      var code = e.keyCode || e.which;
      
      if ((code === 13 && e.ctrlKey === true) || e.type === 'submit') {
        var $target = $(e.currentTarget);
        if (e.type === 'submit') {
          e.preventDefault();
          $target = $('#add-note', $target);
        }
        
        if ($target.val().trim().length > 2) {
          this.model.addNote($target.val());
          $target.closest('form').get(0).reset();
          this.$('.form-error').hide();
        } else {
          this.showError('Note is too short (please type at least 3 chars)');
        }
      }
    },
    showError: function (e) {
      this.$('.form-error').text(e).show();
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
    postInit: function () {
      this.listenTo(this.model, 'sync', this.render);
    },
    preRender: function () {      
      this.setView(new DiagramView({ model: this.model }), '#step-diagram');
      this.showAllErrors();
    },
    
    showAllErrors: function (e) {
      var view = this.setView(new StepErrorsView({ model: this.model }), '#step-errors', true);

      if (e) {
       e.preventDefault(); 
       view.render();
      }
    },
    
    showDetail: function (e) {
      var $target = $(e.currentTarget),
          stepid  = $target.data('id'),
          instances = this.model.get('StepInstances'),
          step;
      
      e.preventDefault();
      
      // exit when click is made on diagram start - no step detail available
      if ($target.hasClass('start')) return;
      
      step   = _.findWhere(instances, { stepid: stepid });
      
      this.setView(new StepInfoView({ item: step, stepid: stepid, template: StepInfoTpl }), '#step-detail', true);
      this.setView(new StepErrorsView({ model: this.model, stepid: stepid }), '#step-errors', true).render();
      
      // box selected styling
      this.$('.box').removeClass('selected');
      $target.addClass('selected');
      this.getView('#step-diagram').hideDropdown();
    }
  });
  
  var MView = Qorus.ModelView.extend({
    postInit: function () {
      this.listenTo(this.model, 'sync', this.render);
    }
  });
  
  ModelView = Qorus.TabView.extend({
    __name__: "OrderView",
    template: Template,
    loader: Qorus.LoaderView,
    additionalEvents: {
      "click .treeview li": "toggleRow",
      "click .showstep": "stepDetail",
      "click tr.parent": "showSubSteps",
      'click button[data-action]': 'runAction',
      "click .copy-paste a": 'setDisplayMode',
      "click .tree-caret": 'toggleTree',
      "click td.editable": 'editTableCell',
      "click .order-lock": 'lockOrder',
      "click .order-unlock": 'unlockOrder',
      "click .order-breaklock": 'breakLockOrder'
    },
    
    url: function () {
      var model = this.model || this.options.model;
      return helpers.getUrl('showOrder', { id: model.id });
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      var model = new Model({ workflow_instanceid: opts.id });
      arguments[0].model = model;
      
      ModelView.__super__.initialize.apply(this, arguments);
      
      if (!_.has(opts, 'show_header'))
        this.options.show_header = true;

      this.model = this.options.model;
      this.listenToOnce(this.model, 'sync', this.render);
      this.listenTo(this.model, 'workflowstatus:change', this.update);
      this.model.fetch();
      this.processPath(opts.path);
    },

    renderNoArgs: function () {
      this.render();
    },

    tabs: {
      'diagram': {
        view: DiagramPaneView
      },
      'steps': {
        view: StepsView
      },
      'data': {
        view: DataView,
        options: {
          name: 'Data',
          template: DataTpl
        }
      },
      'errors': {
        view: ErrorsView,
        options: {
          template: ErrorsTpl,
          name: 'Errors'
        }
      },
      'hierarchy': {
        view: MView,
        options: {
          template: HierarchyTpl,
          name: 'Hierarchy'
        }
      },
      'audit': {
        view: MView,
        options: {
          template: AuditTpl,
          name: 'Audit Events'
        }
      },
      'info': {
        view: MView,
        options: {
          template: InfoTpl,
          name: 'info'
        }
      },
      'notes': {
        view: NotesView,
        options: {
          name: 'Notes'
        }
      } 
    },
    
    update: function () {
      this.model.fetch();
    },
    
    preRender: function () {
      var workflow = new Workflow({ workflowid: this.model.get('workflowid') });
      this.setView(new WorkflowStatus({ model: workflow }), '.workflow-status');
      workflow.fetch();
      
      this.setView(new Toolbar({ model: this.model }), '.toolbar');
      
      if (this.model.get('has_alerts'))
        this.addTabView(new Qorus.ModelView({ model: this.model, template: AlertsTpl }), { name: 'Alerts'});
        
      _.extend(this.context, { 
        show_header: this.options.show_header,
        getStepName: this.getStepName, 
        action_css: context.action_css,
        user: User
      });
      
      this.context.item = this.model.toJSON();
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
    
    setDisplayMode: function (e) {
      var $el = $(e.currentTarget);
      var $parent = $el.parent().parent(); // 2 levels of DIVs

      $('.treeview,.textview,.rawview', $parent).hide();
      $('a[data-mode="treeview"],a[data-mode="textview"],a[data-mode="rawview"]', $parent).removeClass('disabled');
      $('.'+$el.data('mode'), $parent).show();
      $el.addClass('disabled');

      e.preventDefault();
    },
    
    toggleTree: function (e) {
      var $el    = $(e.currentTarget),
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
    },
    
    editTableCell: function (e) {
      var $row   = $(e.currentTarget),
          value  = $row.text(),
          $input = $('<input type="text" />'),
          self   = this;
          
      function save (val) {
        var data     = {},
            property = $row.data('name');
      
        if (moment.isMoment(val))
          val = val.format(settings.DATE_DISPLAY);

        data[property] = val;
      
        if ($row.data('stepid')) data.stepid = $row.data('stepid');
        if ($row.data('ind')) data.stepid = $row.data('ind');

        self.model.doAction($row.data('action'), data);
        value = val;
        clean();
      }
    
      function clean (e) {
        if (e && $(e.target).closest('.datepicker').length) {
        
        } else {
          $input.off().remove();
          $row
            .text(value)
            .toggleClass('editor')
            .removeClass('invalid')
            .width('');
      
          if ($row.data('type') === 'date') {
            self.stopListening(self.views.datepicker);
            self.views.datepicker.close();
            $(document).off('click.datepickerout');
          }
        }
      }
    
      function saveOrClean(e) {
        var $target  = $(e.currentTarget),
            val      = $target.val();
      
        if ($target.key === 13 || e.which === 13) {
          if (utils.validate(val, $row.data('type'))) {
            save(val);
            value = val;
          } else {
            $row.addClass('invalid');
            $target.focus();
          }
        } else {
          clean(e);
        }
      
        e.preventDefault();
      }
      
      if (!$row.hasClass('editor')) {
        $row.width($row.width());
        $row.addClass('editor');
        $input.val(value);
        $row.empty();
        $row.append($input);
        $input.focus();
        
        if ($row.data('type') === 'date') {
          this.views.datepicker = new datepicker();
          this.views.datepicker.show(e);
          this.listenTo(this.views.datepicker, 'applyDate', save);
          $(document).on('click.datepickerout', clean);
        } else if ($row.data('type') === 'boolean') {
          this.views.confirm = new ConfirmView({ title: 'Are you sure', element: $row });
          this.listenTo(this.views.confirm, 'confirm', save);
          this.listenTo(this.views.confirm, 'dismiss', clean);
        } else {
          $input.blur(saveOrClean);
        }
        
        $input.on('keypress', function (e) {
           if (e.keyCode === 13 || e.which === 13) {
             saveOrClean(e);
           } else if (e.keyCode === 27 || e.which === 27) {
             clean();
           }
        });
        
        e.stopPropagation();
      }
    },
    
    lockOrder: function (e) {
      this.applyLock('lock', e);
    },
    
    unlockOrder: function (e) {
      this.applyLock('unlock', e);
    },
    
    breakLockOrder: function (e) {
      this.applyLock('breakLock', e);
    },
    
    applyLock: function (action) {
      this.setView(new ModalView({
        content_view: new OrderLockView({ action: action, model: this.model})
      }), '.order-lock-modal');
    }
  });
  return ModelView;
});
