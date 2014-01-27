define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!templates/common/diagram.html',
  'sprintf',
  'jquery.ui'
], function($, _, Qorus, Template){
  var View = Qorus.View.extend({
    additionalEvents: {},
        
    initialize: function (opts) {
      _.bindAll(this, 'initCanvas');
      this.template = Template;
      View.__super__.initialize.call(this, opts);
      this.on('show', this.render);
    },
    
    onRender: function () {
      _.defer(this.initCanvas);
    },
    
    initCanvas: function () {
      console.log('initializing canvas', this.$el.width());
      var joins;
      var $cnt = this.$('#canvas-container');
      var $cnvs = this.$('#canvas');
      var ctx = this.$('#canvas')[0].getContext("2d");

      // reset canvas dimensions      
      $cnvs
        .width($cnt.width())
        .height($cnt.height())
        .css('top', $cnt.position().top)
        .css('left', $cnt.position().left);

      ctx.canvas.width = $cnt.width();
      ctx.canvas.height = $cnt.height();
      
      // get connections
      joins = this.getConnections();
      
      // draw lines
      _.each(joins, function (join) {
        this.drawJoin(ctx, join);
      }, this);
    },
    
    drawJoin: function (ctx, el_ids) {
      var coords = el_ids.split(',');
      var $el1 = this.$('#ds-'+coords[0]);
      var $el2 = this.$('#ds-'+coords[1]);
      var pad = parseInt($el1.css('margin-top'));
      var cdrs1 = $el1.position();
      var cdrs2 = $el2.position();
      
      cdrs1.center = cdrs1.left + $el1.outerWidth(true) / 2;
      cdrs2.center = cdrs2.left + $el2.outerWidth(true) / 2;
      cdrs2.bottom = cdrs2.bottom || cdrs2.top + $el2.outerHeight();
    
      ctx.moveTo(cdrs1.center, cdrs1.top + pad);
      ctx.lineTo(cdrs1.center, cdrs1.top - 20);
      ctx.lineTo(cdrs2.center, cdrs1.top - 20);
      ctx.lineTo(cdrs2.center, cdrs2.bottom);
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    
    getConnections: function () {
      return this.$('.box').map(function () {
        var conn = [];
        var links = $(this).data('links').toString();
        var id = $(this).data('id');

        if (links) {
          _.each(links.split(','), function (l) {
            conn.push([id, l].join(','));
          });          
        }
        
        return conn;
      });
    }
  });
  return View;
});