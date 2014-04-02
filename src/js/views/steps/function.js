define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/function'),
      Template = require('text!templates/steps/function_modal.html'),
      ModelView;
  
  ModelView = Qorus.View.extend({
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this, 'render');
      
      this.template = Template;
      
      // init model
      this.model = new Model({ function_instanceid: opts.id });
      this.listenTo(this.model, 'change', this.render);
      this.model.fetch();
    },
    render: function (ctx) {
      ModelView.__super__.render.call(this, ctx);
      
      // enable resizable modal window
      // $(".modal").on("resize", function(event, ui) {
      //     ui.element.css("margin-left", -ui.size.width/2);
      //     ui.element.css("margin-top", -ui.size.height/2);
      //     ui.element.css("top", "50%");
      //     ui.element.css("left", "50%");
      // 
      //     $(ui.element).find(".modal-body").each(function() {
      //       $(this).css("max-height", 400 + ui.size.height - ui.originalSize.height);
      //     });
      // });
      
      // $(".modal").resizable();
      debug.log($(".modal"));
    }
  });
  return ModelView;
});
