define(function (require) {
  var Qorus      = require('qorus/qorus'),
      Template   = require('tpl!templates/workflow/instances.html'),
      TableTpl   = require('text!templates/workflow/instances/table.html'),
      RowTpl     = require('text!templates/workflow/instances/row.html'),
      Collection = require('collections/instances'),
      ListView;
  
  ListView = Qorus.ListView.extend({
    template: Template,
    additionalEvents: {
      'click button[data-action]': 'runAction'
    },
    
    initialize: function (opts) {
      ListView.__super__.initialize.call(this, Collection, opts.date, opts);
    },
    
    preRender: function () {
      var view = this.setView(new Qorus.TableView({ 
        collection: this.collection, 
        template: TableTpl,
        row_template: RowTpl,
        context: { url: this.url },
      }), '#order-list');
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
