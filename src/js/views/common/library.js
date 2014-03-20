define(function (require) {
  var $          = require('jquery'),
      Prism      = require('prism'),
      Qorus      = require('qorus/qorus'),
      Template   = require('tpl!templates/common/library.html'),
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
      // this.on('show', this.color);
    },
    
    preRender: function () {
      this.context.lib = this.model.get('lib');
    },
    
    update: function () {
      this.render();
      this.color();
    },
    
    color: function () {
      Prism.highlightAll();
    }
    
  });      
  return View;
});
