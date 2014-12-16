define(function(require) {
  var Qorus             = require('qorus/qorus'),
      ErrorsTableTpl    = require('text!templates/workflow/errors/table.html'),
      ErrorsTpl         = require('tpl!templates/workflow/errors/list.html'),
      ErrorsRowTpl      = require('text!templates/workflow/errors/row.html'),
      ErrorsCollection  = require('collections/errors'),
      View, TableView;
  
  
  TableView = Qorus.TableView.extend({
    row_template: ErrorsRowTpl,
    template: ErrorsTableTpl
  });
  
  
  View = Qorus.View.extend({
    name: 'Error Definitions',
    template: ErrorsTpl,
    postInit: function () {
      var col = new ErrorsCollection([], { workflowid: this.model.id }).fetch();
      this.setView(new TableView({ model: this.model, collection: col }), '.errors-table');
    }
  });
  
  return View;
});