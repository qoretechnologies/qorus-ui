define(function (require) {
  var Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/workflow/autostart.html'),
      View;
  
  View = Qorus.ModelView.extend({
    __name__: "AutostartView",
    template: Template,
    
    additionalEvents: {
      'click [data-action]': 'runAction',
      'input .autostart-change': 'setAutostart',
      'keyup .autostart-change': 'setAutostart'
    },
    
    initialize: function () {
      View.__super__.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change:exec_count', this.render);
    },
        
    setAutostart: function (e) {
      var $target = $(e.currentTarget),
          code    = e.keyCode || e.which,
          value   = parseInt($target.text(), 10),
          promise;

      if (code === 13) {
        if (value) {
          promise = this.model.setAutostart(value);
          promise.fail(this.render);
          $target.blur();
        }
      }
      
    },

    runAction: function (e) {
      var data = e.currentTarget.dataset;
      if (data.action) {
        this.model.doAction(data.action);
        e.preventDefault();
        e.stopPropagation();
      }
    },
    
    off: function () {
      this.clean();
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    }
  });
  
  
  return View;
});
