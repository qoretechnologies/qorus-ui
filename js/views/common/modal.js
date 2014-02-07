define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!templates/common/modal.html',
  'sprintf',
  'jquery.ui'
], function($, _, Qorus, Template){
  
  // var modal wrapper
  var Modal = Qorus.View.extend({
    template: Template,
    
    initialize: function (opts) {
      this.opts = opts;
      this.views = {};
    },
                
    onRender: function () {
      var self = this;
      var $modal = this.$('.modal');
      
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
        var max_height = $(window).innerHeight() - $('.modal').position().top * 2;
        var max_width = $(window).innerWidth() - $('.modal').position().top * 2;
        
        self.fixHeight();
        
        // enable resizable
        $(this).resizable({
          handles: "se",
          minHeight: $modal.height(),
          maxHeight: max_height,
          minWidth: $modal.width(),
          maxWidth: max_width
        });
      });
      // console.log(this.views, this.$el);
    },
    
    fixHeight: function () {
      var padding = 15;
      var $modal = this.$('.modal');
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
      this.$el.empty();
    }
  });
  
  
  return Modal
});