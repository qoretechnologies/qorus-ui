define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/step'),
      Template = require('tpl!templates/steps/modal.html'),
      Prism    = require('prism');
  
  var ModelView = Qorus.View.extend({
    __name__: "StepView",
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle'
    },
    
    initialize: function (opts) {
      this.views = {};
      this.options = {};
      this.context = {};
      this.opts = opts;
      
      this.template = Template;
      
      // init model
      this.model = new Model({ stepid: opts.id });
      this.listenTo(this.model, 'change', this.render);
      this.model.fetch();

      this.on('postrender', this.highlight);
    },
    
    preRender: function () {
      this.context.item = this.model.toJSON();
      this.context._item = this.model;
    },
    
    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();
      $target.tab('show');
    },
    
    highlight: function () {
      if (!this.model.get('functions')) return;
      
      _.each(this.model.get('functions'), function (func) {
        var key  = '#step-modal-'+ func.type +' code',
            el   = this.$(key),
            code = Prism.highlight(func.body, Prism.languages.qore),
            div  = document.createElement('div');

        div.innerHTML = code;
        el.append(div);
      }, this);
    }
  });
  
  return ModelView;
});
