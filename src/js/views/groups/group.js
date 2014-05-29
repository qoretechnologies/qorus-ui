define(function (require) {
  var $          = require('jquery'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Model      = require('models/group'),
      Template   = require('tpl!templates/groups/detail.html'), 
      ModelView;
  
  
  ModelView = Qorus.ModelView.extend({
    title: "Group",
    template: Template,
    additionalEvents: {
      "click [data-action]": "doAction"
    },
    
    initialize: function (opts) {
      this.opts = {};
      this.options = {};
      this.context = {};
      this.views = {};
      _.bindAll(this); 
      ModelView.__super__.initialize.call(this, opts);
      
      this.model = new Model({ name: opts.name });
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(Dispatcher, 'group:status_changed', this.update);
      this.model.fetch();
    },
        
    doAction: function (e) {
      var $target = $(e.currentTarget),
          action  = $target.data('action'),
          data    = $target.data();
  
      e.preventDefault();
      this.model.doAction(action, data);
    },
    
    update: function (e, evt) {
      if (e.info.name !== this.model.get('name')) return;

      if (evt === 'group:status_changed') {
        this.model.set('enabled', e.info.enabled);
      }
    }
  });
  
  return ModelView;
});
