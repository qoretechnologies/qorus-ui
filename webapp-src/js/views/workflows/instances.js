define(function (require) {
  var Qorus = require('qorus/qorus'),
      Template = require('tpl!templates/workflow/instances.html'),
      ListView;
  
  ListView = Qorus.ListView.extend({
    template: Template,
    additionalEvents: {
      'click button[data-action]': 'runAction'
    },

    runAction: function(e) {
      e.preventDefault();
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        var inst = this.collection.get(data.id);
        inst.doAction(data.action);
      }
    }
  });
  
  return ListView;
});
