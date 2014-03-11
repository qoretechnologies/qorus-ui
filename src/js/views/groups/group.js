define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/group',
  'text!templates/groups/detail.html'
], function ($, _, Qorus, Dispatcher, Model, Template) {
  var ModelView = Qorus.View.extend({
    title: "Group",
    template: Template,
    additionalEvents: {
      "click button[data-action]": "runAction",
    },
    
    initialize: function (opts) {
      this.views = {};
      _.bindAll(this); 
      ModelView.__super__.initialize.call(this, opts);
      
      this.model = new Model({ name: opts.name });
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(Dispatcher, 'group:status_changed', this.update);
      this.model.fetch();
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      ModelView.__super__.render.call(this, ctx);
    },
    
    runAction: function (e) {
      var $target = $(e.currentTarget),
        data = e.currentTarget.dataset,
        inst;
      
      if (data.action && data.action != 'open' && data.action !== 'execute') {
        if (data.id == 'selected') {
          this.runBatchAction(data.action, data.method, _.omit(data, 'action', 'method', 'id'));
        } else if (data.id) {
          if (!$target.hasClass('action-modal')) {
            inst = this.model;
            inst.doAction(data.action, data);            
          }
        }
      } else if (data.action == 'open') {
        this.openURL($target.data('url') || $target.attr('href'));
      }
      e.preventDefault();
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