define(function (require) {
  require('jquery-ui');
  
  var $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/common/bottom_bar.html'),
      View;
  
  
  View = Qorus.View.extend({
    additionalEvents: {
      "click button[data-hide]": 'hide',
      "click .nav-tabs a": 'tabToggle'
    },
        
    initialize: function (opts) {
      _.bindAll(this);
      this.template = Template;
      View.__super__.initialize.call(this, opts);
      this.height = 200;
    },
    
    addSizeHandler: function () {
      var offset = $('#split-panes').offset();
      
      if (offset) {
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
      }
    },
    
    resize: function (event, ui) {
      var bpos = ui.position.top + $('.handler').height();
      var height = $('#split-panes').height();
      
      // set heights
      this.height = height - bpos;
      $('#bottom-bar').height(this.height);
      $('#bottom-bar').css('top', bpos);
      $('.handler').prev().height(ui.position.top);
      $('.handler').next().height(height - ui.position.bottom);
    },
    
    // resets heights of top pane
    reset: function() {
      this.setHeights();
      var h = $('#split-panes').height();
      $('.handler').prev().height(h);
    },
    
    onRender: function () {
      var self = this;

      self.hide();
      // reset size when window size 
      $(window).resize(function(){
        self.setHeights();
      });
      self.addSizeHandler();
    },
    
    setHeights: function () {
      var h = $(window).height() - $('#header').height() - $('#footer').height();
      
      var bpos = h - this.height;
      
      $('#split-panes').height(h);
      
      // reset element height
      $('#bottom-bar', this.$el).height(this.height);
      
      // set positions
      $('#bottom-bar').css('top', bpos);
      $('#split-panes .handler').css('top', bpos - $('#split-panes .handler').height());
    },
    
    show: function () {
      this.setHeights();
      if (this.activeTab){
        $('a[href="' + this.activeTab + '"]').tab('show');
      }
      $('#bottom-bar').show();
      $('#split-panes .handler').show();
    },
    
    hide: function () {
      $('#bottom-bar').hide();
      $('#split-panes .handler').hide();
      this.reset();
    },
    
    tabToggle: function (e) {
      var $target = $(e.currentTarget);
      e.preventDefault();

      $target.tab('show');
      this.activeTab = $target.attr('href');
    }
  });
  return View;
});
