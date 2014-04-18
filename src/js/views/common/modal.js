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
      this.$el.modal();
      
      // fix size on resize event
      this.$el.on("resize.modal", function(event, ui) {
          ui.element.css("margin-left", -ui.size.width/2);
          ui.element.css("left", "50%");
          self.fixHeight();
      });

      // assign attributes on modal shown event
      this.$el.on('shown.modal', function () {
        var max_height = $(window).innerHeight() - $(this).position().top * 2;
        var max_width = $(window).innerWidth() - $(this).position().top * 2;
        
        // enable resizable
        $(this).resizable({
          handles: "se",
          minHeight: self.$el.height(),
          maxHeight: max_height,
          minWidth: self.$el.width(),
          maxWidth: max_width
        });
      });
      
      this.$el.on('shown.modal', this.fixeHeight);
      
      this.$el.on('hide.modal', $.proxy(this.off, this));
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
      if (this.$('.modal').hasClass('ui-resizable')) {
        this.$('.modal').resizable('destroy');
      }
      // this.$el.off();
    },
    // 
    // off: function () {
    //   this.clean();
    //   this.undelegateEvents();
    //   this.stopListening();
    //   this.$el.remove();
    // }
  });
  
  
  return Modal;
});
