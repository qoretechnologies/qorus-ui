define(function (require, exports, module) {
  var _              = require('underscore'),
      Qorus          = require('qorus/qorus'),
      StepErrorsTpl  = require('tpl!templates/workflow/orders/steperrors.html'),
      TableTpl       = require('text!templates/workflow/orders/errors/table.html'),
      RowTpl         = require('text!templates/workflow/orders/errors/row.html'),
      SystemSettings = require('models/settings'),
      Toolbar        = require('views/toolbars/toolbar'),
      View, TableView;
      
  TableView = Qorus.TableView.extend({
    template: TableTpl, 
    row_template: RowTpl,
    onRender: function () {
      console.log(this.views);
    }
  });
  
  // View showing step associated errors
  View = Qorus.View.extend({
    __name__: 'StepErrorsView',
    template: StepErrorsTpl,
    postInit: function () {
      this.listenTo(this.model, 'sync', this.update);
      this.update();
    },
    onRender: function () {
      // init popover on info text
      // this.$('td.info').each(function () {
      //   var text = '<textarea>' + $(this).text() + '</textarea>';
      //   $(this).popover({ content: text, title: "Info", placement: "left", container: "#diagram", html: true});
      // });
      this.wrap();
    },

    update: function () {
      var errors = this.model.get('ErrorInstances');
  
      if (this.options.stepid)
        errors = _.where(errors, { stepid: this.options.stepid });
    
      this.collection = new Qorus.SortedCollection(errors);
      this.setView(new TableView({ collection: this.collection }), '.errors-table');
      this.render();
    },

    off: function () {
      if (this.clean) this.clean();
      if (this.$fixed_pane) {
        // console.log('destroying resizable');
        this.$fixed_pane.off();
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
          height, $fixed_pane;
  
      $div
        .addClass('fixed-pane-bottom');
    
      // add parent pusher      
      this.$el.parent().append($push);
  
      // wrap the view element
      this.$el.wrap($divw).wrap($div).wrap($div_inner);
  
      $fixed_pane = this.$el.parents('.fixed-pane');
  
      // get stored height
      height = SystemSettings.get(height_settings);
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
      this.$fixed_pane.on('resize', function (e, ui) {
        var $el = ui.element;
        $el.parent().next().height(ui.size.height);
      });
      this.$fixed_pane.on('resizestop', $.proxy(function (event, ui) {
        SystemSettings.set(height_settings, ui.size.height);
        SystemSettings.save();
      }, this));
    }
  });
  
  return View;
});
