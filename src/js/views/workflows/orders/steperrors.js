define(function (require, exports, module) {
  var _               = require('underscore'),
      $               = require('jquery'),
      Backbone        = require('backbone'),
      Qorus           = require('qorus/qorus'),
      StepErrorsTpl   = require('tpl!templates/workflow/orders/steperrors.html'),
      TableTpl        = require('text!templates/workflow/orders/errors/table.html'),
      RowTpl          = require('text!templates/workflow/orders/errors/row.html'),
      SystemSettings  = require('models/settings'),
      BaseToolbar     = require('views/toolbars/toolbar'),
      ToolbarTpl      = require('tpl!templates/workflow/orders/errors/toolbar.html'),
      Modal           = require('views/common/modal'),
      ErrorModalTpl   = require('tpl!templates/workflow/orders/errors/modal.html'),
      RowInfoTpl      = require('tpl!templates/workflow/orders/errors/rowinfo.html'),
      Loggers         = require('collections/loggers'),
      CopyView        = require('views/common/table.copy'),
      View, TableView, SEVERITIES, Toolbar, ErrorModal, ErrorModalContent, RowView, RowInfoView;
      
  require('jquery.ui');
  require('bootstrap');
      
  SEVERITIES = [
    'FATAL',
    'MAJOR',
    'WARNING',
    'INFO',
    'NONE'
  ];
  
  Toolbar = BaseToolbar.extend({
    fixed: true,
    template: ToolbarTpl,
    
    additionalEvents: {
      'click button.warnings': 'toggleWarnings',
      'click .disabled': 'disable'
    },
    
    preRender: function () {
      _.extend(this.context, {
        predefined_statuses: SEVERITIES,
        count: this.options.count
      });
      this.setView(new CopyView({ csv_options: { el: '.errors-table table' }, css_class: 'btn-small disabled' }), '#table-copy');
    },
    onRender: function () {
      Toolbar.__super__.onRender.apply(this, arguments);
      this.addMultiSelect();
      this.enableButtons();
    },
    
    enableButtons: function () {
      if (this.options.errors) 
        this.$('.disabled').removeClass('disabled');
    },
    
    addMultiSelect: function () {
      var self = this;
      // apply bootstrap multiselect to #statuses element      
      $('#severities').multiselect({
        buttonClass: "btn btn-small disabled",
        onChange: function(el, checked){
          var sl = [], val = $(el).val();
          if (self.options.statuses) {
            sl = self.options.statuses.split(',');
          }
          
          if (checked) {
            sl.push(val);

            // check if alias for all and than check/uncheck all statuses
            if(val=='all'){
              $('option[value!="all"]', $(el).parent()).removeAttr('selected');
              sl = ['all'];
            } else {
              $('option[value="all"]', $(el).parent()).removeAttr('selected');
              sl = _.without(sl, 'all');
            }
          } else {
            if(val=='all'){
              $('option', $(el).parent()).removeAttr('selected');
            }else{
             sl = _.without(sl, val); 
            }
          }
          // refresh valudes
          $('#severities').multiselect('refresh');
          self.options.statuses = sl.join(',');
          self.trigger('filter', self.options.statuses);
        }
      });
    },
    
    toggleWarnings: function (e) {
      var $el = $(e.currentTarget), text;
      
      if ($el.hasClass('disabled')) return this;
      
      if ($el.hasClass('show-warnings')) {
        this.trigger('errors', 'show');
        this.$('button.warnings i').removeClass('icon-check-empty').addClass('icon-check');
        text = 'Hide';
      } else {
        this.trigger('errors', 'hide');
        this.$('button.warnings i').removeClass('icon-check').addClass('icon-check-empty');
        text = 'Show';
      }
      this.$('button.warnings').toggleClass('show-warnings');
      this.$('button.warnings span').text(text);
    },
    
    disable: function (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
  
  ErrorModalContent = Qorus.ModelView.extend({
    template: ErrorModalTpl
  });
  
  ErrorModal = Modal.extend({
    postInit: function () {
      var self = this;
      _.bindAll(this, 'selectAll');
      $(document).on('focusin.modal', function (e) {
        if (e.target !== self.el) return;
        self.selectAll();
      });
    },
    selectAll: function () {
      this.$('.copy-error').focus().select();
    }
  });
  
  RowInfoView = Qorus.ModelView.extend({
    tagName: 'tr',
    additionalEvents: {
      "click .copy-error": 'copyError'
    },
    template: RowInfoTpl,
    postInit: function () {
      this.parent = this.options.parent;
    },
    copyError: function () {
      if (this.parent)
        this.parent.parent.trigger('copy', this.parent.model);
    },
    clean: function () {
      this.parent = this.options.parent = null;
    }
  });
  
  RowView = Qorus.RowView.extend({
    additionalEvents: {
      "click": 'toggleWarning'
    },
    postInit: function () {
      _.bindAll(this);
      this.listenTo(this.parent, 'errors:show', this.showWarning);
      this.listenTo(this.parent, 'errors:hide', this.hideWarning);
    },
    showWarning: function (force) {
      if (this.shown && force !== true) return this;
      var view = this.setView(new RowInfoView({ model: this.model, parent: this }), '_info');
      
      this.$el.after(view.render().$el);
      this.shown = true;
      return this;
    },
    hideWarning: function () {
      this.getView('_info').close();
      this.shown = false;
      return this;
    },
    toggleWarning: function () {
      return this.shown ? this.hideWarning() : this.showWarning();
    },
    onRender: function () {
      if (this.shown) _.defer(this.showWarning, true);
    }
  });
  
  TableView = Qorus.TableView.extend({
    __name__: 'StepErrorTableView',
    fixed: true,
    template: TableTpl, 
    row_template: RowTpl,
    row_view: RowView,
    postInit: function () {
      this.update();
    }
  });
  
  // View showing step associated errors
  View = Qorus.View.extend({
    __name__: 'StepErrorsListView',
    template: StepErrorsTpl,
    additionalEvents: {
      'click .copy-last-error': 'copyLastError'
    },
    
    postInit: function () {
      var errors  = this.model.get('ErrorInstances'),
          toolbar = this.getView('.toolbar'),
          name    = this.model.get('name'),
          log     = Loggers.find(function (item) { return item.get('type') === 'workflow' && item.get('name') === name; }),
          table;
      
      // add logger info to model
      this.model.set({ log: log }, { silent: true });
        
      if (this.options.stepid)
        errors = _.where(errors, { stepid: this.options.stepid });
    
      this.collection = new Qorus.SortedCollection(errors, { sort_key: 'created', sort_order: 'des' });
      table = this.setView(new TableView({ collection: this.collection }), '.errors-table');
      
      toolbar = this.setView(new Toolbar({ errors: this.collection.size() > 0, count: this.collection.size() }), '.toolbar');
  
      this.listenTo(toolbar, 'filter', this.filterErrors);
      this.listenTo(this.model, 'sync', this.update);

      table.listenTo(toolbar, 'errors', function (state) {
        table.trigger('errors:' + state);
      });

      this.listenTo(table, 'copy', this.showErrorModal);

      this.render();
    },
    
    onRender: function () {
      // init popover on info text
      // this.$('td.info').each(function () {
      //   var text = '<textarea>' + $(this).text() + '</textarea>';
      //   $(this).popover({ content: text, title: "Info", placement: "left", container: "#diagram", html: true});
      // });
      this.wrap();
    },
    
    filterErrors: function (statuses) {
      statuses = statuses.toLowerCase();
      
      if (statuses === 'all') {
        this.$('.errors-table tbody tr').show();
        return this;
      }
      
      var states = statuses.split(',');
      
      this.$('.errors-table tbody tr').hide();
      this.$('.errors-table td').filter(function () {
        return states.indexOf($(this).text().toLowerCase()) > -1;
      }).parent().show();
      
      return this;
    },
    
    close: function () {
      if (this.clean) this.clean();
      if (this.$fixed_pane.hasClass('ui-resizable')) {
        this.$fixed_pane.resizable('destroy');
        this.$fixed_pane.off();
        this.$fixed_pane = null;
      }
      this.undelegateEvents();
      this.stopListening();
      
      // remove fixed pane wrappers and empty el
      this.$el
        .unwrap()
        .unwrap()
        .unwrap()
        .empty();
      this.$el.parent()
        .find('.fixed-pane-push.push')
        .remove();
    },

    /* wraps view element to make it fixed position and resizable */
    wrap: function () {
      var $divw           = $('<div class="fixed-pane-wrapper" />'),
          $div            = $('<div class="fixed-pane" />'),
          $div_inner      = $('<div class="fixed-pane-inner" />'),
          $push           = $('<div class="fixed-pane-push push"/>'),
          height_settings = [module.id.replace(/\//g, '.'), this.__name__, 'height'].join('.'),
          height;
  
      $div
        .addClass('fixed-pane-bottom');
    
      // add parent pusher      
      this.$el.parent().append($push);
  
      // wrap the view element
      this.$el.wrap($divw).wrap($div).wrap($div_inner);
  
      this.$fixed_pane = this.$el.parents('.fixed-pane');
  
      // get stored height
      height = SystemSettings.get(height_settings);
      if (height) this.$fixed_pane.height(height);
  
      // change push height according to pane height
      $push.height(this.$fixed_pane.outerHeight(true));

      // resizable
      this.$fixed_pane.resizable({
        handles: 'n',
        maxHeight: $(window).height() - 200,
        minHeight: 150
      });
  
      this.$fixed_pane.on('resize', function (e, ui) {
        var $el = ui.element;
        $el.parent().next().height(ui.size.height);
      });
      this.$fixed_pane.on('resizestop', $.proxy(function (event, ui) {
        SystemSettings.set(height_settings, ui.size.height);
        SystemSettings.save();
      }, this));
    },
    
    showErrorModal: function (err) {
      var stepid = err.stepid || err.get('stepid'),
          stepname  = _.find(this.model.get('StepInstances'), { stepid: stepid }).name,
          ErrorView = new ErrorModalContent({ 
            model: this.model, 
            error: (err instanceof Backbone.Model) ? err.toJSON() : err,
            url: this.getViewUrl(),
            stepname: stepname
          });
          
      this.setView(new ErrorModal({ content_view: ErrorView }), '#modal');
    },
    
    copyLastError: function (e) {
      if (e.isDefaultPrevented()) return this;
      
      var errors    = this.model.get('ErrorInstances'),
          err       = _.sortBy(errors, 'created')[0];

      this.showErrorModal(err);
    }
  });
  
  return View;
});
