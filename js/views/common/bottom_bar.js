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
      _.bindAll(this);
      this.template = Template;
      View.__super__.initialize.call(this, opts);
      this.on('render', this.addSizeHandler);
      this.height = 150;
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

      // fix height without padding
      var padding = parseInt(parent.css('padding-top')) + parseInt(parent.css('padding-bottom'));
      
      // save the current height
      this.height = $(window).height() - ui.offset.top - padding;
      
      // update element height
      parent.height(this.height);
      ui.position.top = 0;
    },
    render: function(){
      View.__super__.render.call(this);
      // reset element height
      $('.bottom-bar', this.$el).height(this.height);
    }
  });
  return View;
});
