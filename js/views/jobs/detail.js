define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/job/meta.html'),
      LogView  = require('views/log'),
      View;
  
  View = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      'click .nav-tabs a': 'tabToggle'
    },
    
    initialize: function ( opts) {
      this.opts = opts;
      this.model = opts.model;
      this.listenTo(this.model, 'change', this.render);
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      View.__super__.render.call(this, ctx);
    },
    
    preRender: function () {
      var url = '/jobs/' + this.model.id;
      this.setView(new LogView({ socket_url: url, parent: this }), '#log');
    },
    
    off: function () {
      this.removeViews();
      this.undelegateEvents();
      this.stopListening();
    },
    
    tabToggle: function (e) {
      var $target = $(e.currentTarget),
          active  = $('.tab-pane.active'),
          target_name = $target.data('target') || $target.attr('href'),
          view;

      e.preventDefault();
      
      console.log('preventing default');
      
      view = this.getView(target_name);
      if (view) view.trigger('show');

      $target.tab('show');

      this.active_tab = $target.attr('href');
    }
  });    
  return View;
});
