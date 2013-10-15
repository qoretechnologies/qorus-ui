(function($) {
$.fn.sticky = function(options){
  var opts = {
    top: 40,
    el: $(window)
  };

  if (options === 'remove') {
    $('.sticky-clone').remove();
    $(opts.el).off('scroll');
    return this;
  }
  
  if (options){ $.extend(opts, options); }
  return this.each(function (){
    var o = $(this);
    var pos = o.offset().top - opts.top;
    o._clone = o.clone();
    var $el = $(opts.el);
    
    // just added for smooth scrolling
    o._clone.addClass('sticky-clone');
    
    $el.on('scroll', function(){
        if($el.scrollTop() > pos)
        {
          o.after(o._clone);
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
