define(function (require) {
  var $              = require('jquery'),
      Rainbow        = require('rainbow'),
      Qorus          = require('qorus/qorus'),
      functionModel  = require('models/function'),
      constantsModel = require('models/constant'),
      Template       = require('tpl!templates/common/library.html'),
      PaneTemplate   = require('tpl!templates/common/library_pane.html'),
      View, Pane;

  require('rainbow.qore');

  Pane = Qorus.View.extend({
    __name__: 'PaneView',
    template: PaneTemplate,
    
    additionalEvents: {
      'click .nav-list a': 'tabToggle'
    },
    
    initialize: function (opts) {
      this.views = {};
      this.opts = opts || {};
      this.name = this.opts.name;
      this.model = opts.model;
    },
    
    preRender: function () {
      this.context.data = this.model.get('lib')[this.name];
    },
        
    tabToggle: function (e) {
      var $target = $(e.currentTarget);
      e.preventDefault();
      e.stopPropagation();
      $target.tab('show');
    }
  });

  
  View = Qorus.View.extend({
    __name__: "LibraryView",
    url: "/Library",
    name: 'Library',
    template: Template,
    initialize: function (opts) {
      var keys;
      
      this.views = {};
      this.model = opts.model;
      View.__super__.initialize.apply(this);
      
      this.model.getProperty('lib', { lib_source: true }, true);
      this.listenTo(this.model, 'update:lib', this.update);
      this.on('postrender', this.color);
    },
    
    preRender: function () {
      this.context.lib = this.model.get('lib');
    },
    
    update: function () {
      this.render();
      Rainbow.color();
    }
    
  });      
  return View;
});
