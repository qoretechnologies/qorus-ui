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
      this.listenTo(this.model, 'update:lib', this.render);
      // this.on('postrender', function () { Rainbow.color() });
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

  
  View = Qorus.TabView.extend({
    __name__: "LibraryView",
    name: 'Library',
    template: Template,
    initialize: function (opts) {
      var keys;
      
      this.views = {};
      this.model = opts.model;
      View.__super__.initialize.apply(this);
      
      this.model.getProperty('lib', { lib_source: true }, true);
    },
    
    preRender: function () {
      this.removeView('tabs');
      
      if (this.model.get('lib')) {
        keys = _.keys(this.model.get('lib'));
      
        _.each(keys, function (key) {
          this.addTabView(new Pane({ model: this.model, name: key }));
        }, this);        
      }
    }
  });      
  return View;
});
