define(function (require, exports, module) {
  var $              = require('jquery'),
      _              = require('underscore'),
      Qorus          = require('qorus/qorus'),
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
      _.bindAll(this);
      this.opts = opts;

      View.__super__.initialize.call(this);
    },
    
    // override default procesPath to delegate full-path to the content_view
    processPath: function () {
      var tail = View.__super__.processPath.apply(this, arguments);
      return this.path;
    },
    
    render: function () {
      View.__super__.render.apply(this, arguments);
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
      
      this.off();
      this.trigger('closed');
    },
    
    off: function () {
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
        resize: function (event, ui) {
          // fix the element left position
          ui.element
            .css('left', '')
        },
        stop: function (event, ui) {
          SystemSettings.set(width_n, ui.size.width);
          SystemSettings.save();
        }
      });
    },
    getStorageKey: function () {
      return [module.id.replace(/\//g, '.'), this.opts.content_view.__name__].join('.');
    }
  });
  
  return View;
});
