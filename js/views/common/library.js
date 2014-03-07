define(function (require) {
  var $              = require('jquery'),
      Rainbow        = require('rainbow'),
      Qorus          = require('qorus/qorus'),
      Template       = require('tpl!templates/common/library.html'),
      View;

  require('rainbow.qore');
  
  View = Qorus.View.extend({
    __name__: "LibraryView",
    url: "/Library",
    name: 'Library',
    template: Template,
    initialize: function (opts) {
      this.views = {};
      this.model = opts.model;
      View.__super__.initialize.apply(this);
      
      this.model.getProperty('lib', { lib_source: true }, true);
      this.listenTo(this.model, 'update:lib', this.update);
      this.on('show', this.color);
    },
    
    preRender: function () {
      this.context.lib = this.model.get('lib');
    },
    
    update: function () {
      this.render();
    },
    
    color: function () {
      console.log('should color?', this._is_colored);
      if (this._is_colored) return;
      console.log('coloring');
      
      Rainbow.color(this.$el);
      this._is_colored = true;
    }
    
  });      
  return View;
});