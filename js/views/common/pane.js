define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/common/pane.html'),
      View;

  View = Qorus.View.extend({
    cls: 'PaneView',
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
      this.render();
    },
    
    // override default procesPath to delegate full-path to the content_view
    processPath: function () {
      var tail = View.__super__.processPath.apply(this, arguments);
      return this.path;
    },
    
    onRender: function () {
      if (this.opts.content_view) {
        this.setView(this.opts.content_view, '.content', true);
        this.$el.data('id', this.opts.content_view.model.id);
        // console.log(this.opts.content_view.$el);
      }
      this.$('.pageslide')
        .addClass('show')
        .outerWidth(this.opts.width);
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
    }
  });
  
  return View;
});
