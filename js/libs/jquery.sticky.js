(function($) {
$.fn.sticky = function(options){
  var opts = {
    top: 40,
    el: $(window)
  };

  if (options === 'remove') {
    console.log($(this).length, this.length);
    this.each(function () { 
      $(this).removeData();
      $(opts.el).off('scroll');
    });
    return this;
  }
  
  if (options){ $.extend(opts, options); }
  return this.each(function (){
    var o = $(this);
    var pos = o.offset().top - opts.top;
    var clone = o.data('_clone', o.clone());
    var $el = $(opts.el);
    
    // just added for smooth scrolling
    clone.addClass('sticky-clone');
    
    $el.on('scroll', function(){
        if($el.scrollTop() > pos)
        {
          o.after(clone);
          o.width(o.width())
            .addClass('affix')
            .addClass('sticker')
            .css('top', opts.top);
        }
        else
        {
          o.next('.sticky-clone').remove();
          o.removeClass('affix')
            .removeClass('sticker');
        }
    });
  })
};

})(jQuery);
