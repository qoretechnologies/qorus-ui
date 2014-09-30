define(function (require) {
  var _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      ConfirmTpl = require('tpl!templates/common/confirm.html'),
      ConfirmView;
      
  ConfirmView = Qorus.View.extend({
    className: "popover fade left in confirm",
    template: ConfirmTpl,
    additionalEvents: {
      'click [data-confirm]': 'saveOrCancel'
    },
    
    initialize: function () {
      ConfirmView.__super__.initialize.apply(this, arguments);
      this.$input_el = $(this.options.element);
      this.$el.appendTo('body');
      this.show();
    },
    
    show: function () {
      var left = this.$input_el.offset().left;
      var top = this.$input_el.offset().top;
      var title;
      
      if (this.$input_el.data('title')) {
        title = this.$input_el.data('title');
      }
      
      this.render({ title: title });
      this.$el
        .show()
        .css('left', left - this.$el.width())
        .css('top', top - (this.$el.height()/2) + (this.$input_el.height()/2));
    },
    
    saveOrCancel: function (e) {
      var $target = $(e.currentTarget);
      
      if ($target.data('confirm') === true) {
        this.$input_el.find('input').val(1);
        this.trigger('confirm', $target.data('confirm'));        
      } else {
        this.trigger('dismiss', $target.data('confirm'));
      }
      
      this.close();
    }
  });
  
  return ConfirmView;
});
