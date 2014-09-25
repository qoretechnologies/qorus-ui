define(function (require) {
  require('backbone');
  
  var $                 = require('jquery'),
      Qorus             = require('qorus/qorus'),
      UserView          = require('views/system/user'),
      Template          = require('text!templates/common/header.html'),
      NotificationsView = require('views/notifications/icon'),
      TaskBar           = require('views/common/taskbar'),
      View;
      
  require('views/system/menu/menu');
  require('views/common/icons');
  
  View = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      "click a.menu-icon": 'menuToggle'
    },
    
    initialize: function (opts) {
      View.__super__.initialize.apply(this, arguments);
      this.model = opts.info;
      this.user = opts.user;
      this.setElement($('#header'));

      this.setView(TaskBar, '#taskbar');
      this.listenTo(this.model, 'change', this.update);
      this.render();
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      View.__super__.render.call(this, ctx);
      return this;
    },
    
    preRender: function () {
      this.setView(new UserView({ model: this.user }), '#user-info');
      this.setView(new NotificationsView(), '#notifications-icon');
    },
    
    update: function () {
      this.$('.instance-key').text(this.model.get('instance-key'));
      this.$('.version').text(this.model.get('version'));
    },
    
    menuToggle: function (e) {
      e.preventDefault();
      $('#wrap').toggleClass('offset');
      $('aside.navigation').toggleClass('opacity');
      $('html').on('click.navigation', $.proxy(function (e) { 
        if (e.isDefaultPrevented()) return;
        $('html').off('click.navigation');
        $('#wrap').toggleClass('offset');
        $('aside.navigation').toggleClass('opacity');
      }, this));

    // },
    //
    // clean: function () {
    //   this.undelegateEvents();
    //   this.$el.empty();
    }
  });
  
  return View;
});
