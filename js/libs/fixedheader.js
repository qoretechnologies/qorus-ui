(function($) {

$.fn.fixedHeader = function (options) {
 var config = {
   //bgColor: 'white'
 };
 if (options){ $.extend(config, options); }

 return this.each( function() {
  var o = $(this),
    $win = $(config.el),
    $head = $('thead.header', o),
    $clone = $head.clone(),
    header_width = $head.width();

  $clone
    .removeClass('header')
    .addClass('header-copy header-fixed')
    .addClass('hide')
    .appendTo(o);
  
  o.find('thead.header > tr:first > th').each(function (i, h){
    var w = $(h).width();
    o.find('thead.header-copy> tr > th:eq('+i+')').width(w)
  });
  $head.css({ margin:'0 auto',
              width: o.width(),
             'background-color': config.bgColor });

   o.find('thead.header-copy')
     .width(header_width);

   // set offset after rendering
   setTimeout(function () {
     o.find('thead.header-copy')     
          .css('top', o.offset().top)
          .toggleClass('hide');
   }, 0);
 });
};

})(jQuery);