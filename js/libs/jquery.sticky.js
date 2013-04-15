(function($) {
$.fn.sticky = function(options){
  var opts = {
    top: 40
  };
  if (options){ $.extend(config, options); }
  return this.each(function (){
    var o = $(this);
    var pos = o.offset().top - opts.top;
    var oclone = o.clone();
    
    // just added for smooth scrolling
    oclone.addClass('sticky-clone');
    
    $(window).scroll(function(){
        if($(window).scrollTop() > pos)
        {
          o.after(oclone);
          o.width(o.width())
            .addClass('affix')
            .addClass('sticker')
            .css('top', opts.top);
        }
        else
        {
          o.next('.sticky-clone').hide();
          o.removeClass('affix')
            .removeClass('sticker');
        }
    });
  })
};

})(jQuery);
