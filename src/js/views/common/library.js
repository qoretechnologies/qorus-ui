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
      this.model = opts.model;
      View.__super__.initialize.apply(this);
      
      this.model.getProperty('lib', { lib_source: true }, true);
      this.listenTo(this.model, 'change:lib', this.render);
      // this.on('show', this.color);
    },
    
    preRender: function () {
      this.context.lib = this.model.get('lib');
    },
    
    onRender: function () {
      this.color();
    },
    
    color: function () {
      Prism.highlightAll();
    }
    
  });      
  return View;
});
