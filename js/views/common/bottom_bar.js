define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!/templates/common/bottom_bar.html',
  'sprintf',
  'jquery.ui'
], function($, _, Qorus, Template){
  var View = Qorus.View.extend({
    initialize: function(opts){
      this.template = Template;
      View.__super__.initialize.call(this, opts);
      this.on('render', this.addSizeHandler);
    },
    addSizeHandler: function(){
      $('.handler').draggable({
        axis : 'y',
        containment: [
          null,
          
        ],
        drag : this.resize
      });
    },
    resize: function(event, ui){
      var parent = $('.bottom-bar');
      parent.height($(window).height() - ui.offset.top);
      ui.position.top = 0;
      console.log(this.originalHeight, parent.height(), ui.offset.top);
    }
  });
  return View;
});
