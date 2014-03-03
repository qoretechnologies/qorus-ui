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
          value   = parseInt($target.text(), 10);
      
      if (code === 13) {
        if (value) {
          this.model.setAutostart(value);
          $target.blur();
        }
      } else {        
        if (!value) {
          $target.text(0);
          this.model.setAutostart(0);
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
      console.log('cleaning');
      this.clean();
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    }
  });
  
  
  return View;
});
