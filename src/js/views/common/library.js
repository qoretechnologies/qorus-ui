define(function (require) {
  var _        = require('underscore'),
      Prism    = require('prism'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/common/library.html'),
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
      // highlight source codes
      if (this.model.get('lib')) {
        _.each(this.model.get('lib'), function (lib) {
          _.each(lib, function (fn) {
            if (!fn.body) return;
            var key = '#' + fn.name + ' code',
                el  = this.$(key),
                div = document.createElement('div'),
                code = Prism.highlight(fn.body, Prism.languages.qore);
              
                div.innerHTML = code;
                el.append(div);
          }, this);
        }, this);
      }
    },
    
    clean: function () {
      this.model = null;
    }
    
  });
  
  return View;
});
