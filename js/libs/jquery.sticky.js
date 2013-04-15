(function($) {
$.fn.sticky = function(options){
  var opts = {
    top: 40,
    el: $(window)
  };
  if (options){ $.extend(opts, options); }
  return this.each(function (){
    var o = $(this);
    var pos = o.offset().top - opts.top;
    var oclone = o.clone();
    var $el = $(opts.el);
    
    console.log("Sticky opts", opts);
    
    // just added for smooth scrolling
    oclone.addClass('sticky-clone');
    
    $el.scroll(function(){
        if($el.scrollTop() > pos)
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
