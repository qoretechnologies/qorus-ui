/**
  Simple fixed header based on CSS
  It wrapps table in 2 containers and each th content is wrapped with positioned div.
  Copy these styles to the stylesheet.
  .table-fixed-wrapper {
      position: relative;
      height: 100%;
  }

  .table-fixed-inner {
      overflow-x: hidden;
      overflow-y: auto;
      height: 100%;
  }

  .table-fixed .inner {
      position: absolute;
      top: 0;
      height: 100%;
  }
*/

(function($) {
$.fn.fixedhead = function (options) {
  options = options || {};
  
  return this.each(function () {
    var $el = $(this);
    if (!$el.hasClass('is-fixed')) {
      var $twrap = $('<div class="table-fixed-wrapper" />');
      var $twrapi = $('<div class="table-fixed-inner" />');
      var $thead = $el.find('thead').first();
      var height = $thead.innerHeight();
      var offset = options.offset || 100;
      
      $thead.find('th').each(function () {
        var $divi = $('<div class="inner" />');
        var $this = $(this);

        $divi
          .width($this.width())
          .height(height)
          .css('text-align', $this.css('text-align'));
          
        $(this).wrapInner($divi);
      });
      
      $twrap
        .css('padding-top', height);
      
      $el.wrap($twrapi);
      $el.closest('.table-fixed-inner').wrap($twrap);
      $el.addClass('is-fixed');
      
      $twrap = $el.closest('.table-fixed-wrapper');
      
      $twrap.height($(window).height() - $twrap.offset().top - offset);
    }
  });
};

})(jQuery);