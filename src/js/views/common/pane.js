define(function (require, exports, module) {
  var Qorus          = require('qorus/qorus'),
      Template       = require('tpl!templates/common/pane.html'),
      SystemSettings = require('models/settings'),
      View;

  View = Qorus.View.extend({
    __name__: 'PaneView',
    template: Template,
    views: {},
    additionalEvents: {
      'close': 'close',
      'click .close-view': 'close'
    },
    
    initialize: function (opts) {
      View.__super__.initialize.call(this);
      this.opts = opts;
    },
    
    // override default procesPath to delegate full-path to the content_view
    processPath: function () {
      View.__super__.processPath.apply(this, arguments);
      return this.path;
    },
    
    preRender: function () {
      this.setView(this.opts.content_view, '.content');
    },
    
    onRender: function () {
      var $ps = this.$('.pageslide'),
          width_n = this.getStorageKey() + '.width',
          width = SystemSettings.get(width_n);
          
      if (this.opts.content_view) {
        this.$el.data('id', this.opts.content_view.model.id);
      }

      $ps
        .addClass('show')
        .width(width || this.opts.width);

      this.wrap();
    },
    
    close: function (e) {
      if (e) {
        e.preventDefault();  
      }
      
      this.$('.pageslide').removeClass('show');
      this.$el.data('id', null);
      
      this.close();
      this.trigger('closed');
    },
    
    close: function () {
      this.removeViews();
      this.$('.pageslide').resizable('destroy');
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
      this.trigger('off');
    },
    
    wrap: function () {
      var $ps = this.$('.pageslide'),
          width_n = this.getStorageKey() + '.width',
          width = SystemSettings.get(width_n);
          
      if (width) $ps.width(width);

      $ps.resizable({
        handles: 'w',
        minWidth: 400,
        resize: function (event, ui) {
          // fix the element left position
          ui.element
            .css('left', '');
        },
        stop: function (event, ui) {
          SystemSettings.set(width_n, ui.size.width);
          SystemSettings.save();
        }
      });
    },
    getStorageKey: function () {
      var cvkey = (this.opts.content_view) ? this.opts.content_view.__name__ : this.__name__;
      return [module.id.replace(/\//g, '.'), cvkey].join('.');
    }
  });
  
  return View;
});
