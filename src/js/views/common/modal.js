define(function (require) {
  require('jquery.ui');
  
  var $        = require('jquery'),
      Qorus    = require('qorus/qorus'),
      Template = require('text!templates/common/modal.html'),
      Modal;
  
  // var modal wrapper
  Modal = Qorus.View.extend({
    tagName: 'div',
    className: 'modal hide fade wider',
    attributes: {
      tabindex: -1,
      role: 'dialog',
      'aria-labelledby': 'modalHeader',
      'aria-hidden': true
    },
    template: Template,
    
    initialize: function () {
      Modal.__super__.initialize.apply(this, arguments);
      this.setView(this.options.content_view, '.content');
      this.$el.appendTo('body');
      this.render();
    },
    
    onRender: function () {
      var self = this;
      var $modal = this.$el;
      
      this.fixHeight();
      
      // show modal
      $modal.modal();
      
      // fix size on resize event
      $modal.on("resize", function(event, ui) {
          ui.element.css("margin-left", -ui.size.width/2);
          ui.element.css("left", "50%");
          self.fixHeight();
      });

      // assign attributes on modal shown event
      $modal.on('shown', function () {
        var max_height = $(window).innerHeight() - self.$el.position().top * 2;
        var max_width = $(window).innerWidth() - self.$el.position().top * 2;
        
        self.fixHeight();
        
        // enable resizable
        $(this).resizable({
          handles: "se",
          minHeight: self.$el.height(),
          maxHeight: max_height,
          minWidth: self.$el.width(),
          maxWidth: max_width
        });
      });
    },
    
    fixHeight: function () {
      var padding = 15;
      var $modal = this.$el;
      var max_height = $(window).innerHeight() - $modal.position().top * 2;
      
      
      if ($modal.height() > max_height) {
        $modal.height(max_height);

        var $body = $modal.find('.modal-body');
        var cor = $body.innerHeight() - $body.height();
        var h = $modal.height() - $modal.find('.modal-header').outerHeight() - cor - padding;

        $body.height(h).css('max-height', h);
        debug.log(cor, h, $body.height(), $modal.height());
      }
    },
        
    clean: function () {
      this.$('.modal')
        .css('width', '')
        .css('height', '')
        .css('left', '')
        .css('top', '')
        .css('margin-top', '')
        .css('margin-left', '')
        .unbind();
      
        if (this.$('.modal').hasClass('ui-resizable')) {
          this.$('.modal').resizable('destroy');
        }
    },
    
    off: function () {
      this.clean();
      this.undelegateEvents();
      this.stopListening();
      this.$el.remove();
    }
  });
  
  
  return Modal;
});
