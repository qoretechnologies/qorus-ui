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
//      'aria-labelledby': 'modalHeader',
//      'aria-hidden': true
    },
    template: Template,
    
    initialize: function () {
      Modal.__super__.initialize.apply(this, arguments);
      var cview = this.setView(this.options.content_view, '.content');
      
      this.listenTo(cview, 'close', this.hide);
      this.$el.appendTo('body');
      this.render();
    },
    
    hide: function () {
      this.$el.modal('hide');
      this.close();
    },
    
    onRender: function () {
      var self = this;
      
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
      
      this.$el.on('shown.modal', $.proxy(this.fixHeight, this));
      
      this.$el.on('hide.modal', $.proxy(this.close, this));
      
      $(window).on('resize.'+this.cid, $.proxy(this.fixHeight, this));
    },
    
    fixHeight: function (e) {
      this.$el.css('padding-bottom', this.$el.find('.modal-footer').outerHeight() + 10);
      if (!e || !e.target.tagName) {
        var padding = 15;
        var $modal = this.$el;
        var max_height = $(window).innerHeight() - $modal.position().top * 2;

        if ($modal.height() > max_height) {
          $modal.height(max_height);

          var $body = $modal.find('.modal-body');
          var cor = $body.innerHeight() - $body.height();
          var h = $modal.height() - $modal.find('.modal-header').outerHeight() - cor - padding;

          if ($modal.find('.modal-footer')) {
            h -= $modal.find('.modal-footer').outerHeight() - padding;
          }

          $body.height(h).css('max-height', h);
        }
      }
    },
        
    clean: function () {
      $(window).off('resize.'+this.cid);
      
      if (this.$('.modal').hasClass('ui-resizable')) {
        this.$('.modal').resizable('destroy');
      }
      this.$el.off();
    },
    // 
    // close: function () {
    //   this.clean();
    //   this.undelegateEvents();
    //   this.stopListening();
    //   this.$el.remove();
    // }
  });
  
  
  return Modal;
});