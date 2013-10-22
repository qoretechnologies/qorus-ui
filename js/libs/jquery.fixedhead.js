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
      
      $thead.find('th').each(function () {
        var $divi = $('<div class="inner" />');
        var $this = $(this);

        $divi
          .width($this.width())
          .height($this.height())
          .css('text-align', $this.css('text-align'));
          
        $(this).wrapInner($divi);
      });
      
      $twrap
        .css('padding-top', height);
      
      $el.wrap($twrapi);
      $el.closest('.table-fixed-inner').wrap($twrap);
      $el.addClass('is-fixed');
      
      $twrap = $el.closest('.table-fixed-wrapper');
      $twrap.height($(window).height() - $twrap.offset().top);
    }
  });
};

})(jQuery);
