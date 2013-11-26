define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/common/pane.html'),
      View;

  View = Qorus.View.extend({
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
    
    onRender: function () {
      if (this.opts.content_view) {
        this.setView(this.opts.content_view, '.content', true);
        this.$el.data('id', this.opts.content_view.model.id);
      }
      this.$('.pageslide')
        .addClass('show')
        .outerWidth(this.opts.width);
    },
    
    close: function (e) {
      if (e) {
        console.log(e);
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
