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
    // var $thead = $('thead', $el).first();
    // var $tbody = $('tbody', $el).first();
    // var $clgrp = $('<colgroup />');
    // 
    // $('th', $thead).each(function () {
    //   var $this = $(this),
    //     w = $this.width();
    //   $clgrp.append($('<col />').width(w));
    // });
    // 
    // $thead.prepend($clgrp);
    // console.log($clgrp);
    // $tbody.prepend($clgrp.clone());
    // 
    // 
    // $thead.css('position', 'fixed');

  //   if (!$el.hasClass('is-fixed')) {
  //     var $cl = $el.clone();
  //     var $twrap = $('<div class="table-fixed-wrapper" />'),
  //       $twrapi = $('<div class="table-fixed-inner" />'),
  //       offset = options.offset || 100;
  // 
  //     var $thead = $('thead tr', $el).first();
  //     
  //     var $tclone = $thead.clone().empty();
  //     
  //     var height = $thead.height();
  //     
  //     $('th', $thead).each(function () {
  //       var $divi = $('<div class="inner" />'),
  //         $this = $(this);
  //         $copy = $this.clone();
  // 
  //       $divi
  //         .width($this.width())
  //         .height(height)
  //         .css('text-align', $this.css('text-align'))
  //         .css('margin-left', $this.css('padding-left') * -1);
  //       
  //       $copy.wrapInner($divi);
  //       $tclone.append($copy);
  //     });
  //     $twrap
  //       .css('padding-top', height);
  // 
  //     $('thead tr', $cl).first().replaceWith($tclone);
  //     $cl.appendTo($twrapi);
  // 
  //     $twrapi.appendTo($twrap);
  // 
  //     $cl.addClass('is-fixed');
  // 
  //     $twrap.height($(window).height() - $el.offset().top - offset);
  // 
  //     $el.replaceWith($twrap);
  //   }
  });
};

})(jQuery);