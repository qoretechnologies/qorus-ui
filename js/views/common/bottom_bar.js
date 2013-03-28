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
      var offset = $('#split-panes').offset();
      $('.handler').draggable({
        axis : 'y',
        containment: [
          offset.left,
          offset.top + 200,
          offset.top + $('#split-panes').width(),
          offset.top + $('#split-panes').height() - 200
        ],
        drag : this.resize,
        refreshPositions: true,
        scroll: true
      });
    },
    resize: function(event, ui){
      var parent = $('#bottom-bar');
      var bpos = ui.position.top + $('.handler').height();
      var height = $('#split-panes').height();
      
      // set heights
      this.height = height - bpos;
      $('#bottom-bar').height(this.height);
      $('#bottom-bar').css('top', bpos);
      $('.handler').prev().height(ui.position.top);
    },
    render: function(){
      View.__super__.render.call(this);
      var h = $(window).height() - $('#header').height() - $('#footer').height();
      
      var bpos = h - this.height;
      
      $('#split-panes').height(h);

      $('#bottom-bar').hide();
      $('#split-panes .handler').hide();
      
      // reset element height
      $('#bottom-bar', this.$el).height(this.height);
      
      // set positions
      $('#bottom-bar').css('top', bpos);
      $('#split-panes .handler').css('top', bpos - $('#split-panes .handler').height());

      return this;
    }
  });
  return View;
});
