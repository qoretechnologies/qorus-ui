define(function (require) {
  var Prism      = require('prism'),
      Qorus      = require('qorus/qorus'),
      Template   = require('tpl!templates/common/library.html'),
      View;
  
  View = Qorus.View.extend({
    __name__: "LibraryView",
    url: "/Library",
    name: 'Library',
    template: Template,
    initialize: function (opts) {
      this.views = {};
      this.context = {};
      this.helpers = {};
      this.opts = {};
      this.model = opts.model;
      View.__super__.initialize.apply(this);
      
      this.model.getProperty('lib', { lib_source: true }, true);
      this.listenTo(this.model, 'change:lib', this.render);
    },
    
    preRender: function () {
      this.context.lib = this.model.get('lib');
    },
    
    onRender: function () {
      this.color();
    },
    
    color: function () {
      Prism.highlightAll();
    },
    
    clean: function () {
      this.model = null;
    }
    
  });      
  return View;
});