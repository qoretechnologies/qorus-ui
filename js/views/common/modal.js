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
    views: {},
    template: Template,
    
    initialize: function () {
      Modal.__super__.initialize.apply(this, arguments);
      console.log('modal', this.opts, this.options);
      this.setView(this.options.content_view, '.content');
    },

    preRender: function () {
      this.$el.appendTo('body');
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

          this.fixHeight();
      }, this);

      // assign attributes on modal shown event
      $modal.on('shown', function () {
        var max_height = $(window).innerHeight() - this.$el.position().top * 2;
        var max_width = $(window).innerWidth() - this.$el.position().top * 2;
        
        this.fixHeight();
        
        // enable resizable
        $(this).resizable({
          handles: "se",
          minHeight: this.$el.height(),
          maxHeight: max_height,
          minWidth: this.$el.width(),
          maxWidth: max_width
        });
      }, this);
      
      // move to body el to fix z-index issues
      console.log('mrdal',$modal);
      console.log(this.views, this.$el);
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

        $body.height(h);
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
