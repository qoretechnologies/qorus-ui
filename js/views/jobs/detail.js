define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/job/meta.html'),
      LogView  = require('views/log'),
      Rainbow  = require('rainbow'),
      View;
  
  View = Qorus.TabView.extend({
    url: function () {
      return "/" + this.model.id;
    },
    
    template: Template,
    
    initialize: function (opts) {
      View.__super__.initialize.apply(this, arguments);
      this.opts = opts;
      this.model = opts.model;
      this.listenTo(this.model, 'change', this.render);
      this.model.getProperty('code');
      this.on('render', function () { Rainbow.color() });
    },
    
    render: function (ctx) {
      var self = this;
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
    }
  });    
  return View;
});
