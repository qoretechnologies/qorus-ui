define(function (require) {
  var Qorus    = require('qorus/qorus'),
      Template = require('text!templates/library/list.html'),
      TableTpl = require('text!templates/library/table.html'),
      RowTpl   = require('text!templates/library/row.html'),
      Library  = require('collections/library'),
      View;
            
  View = Qorus.ListView.extend({
    template: Template,
    
    initialize: function (options) {
      View.__super__.initialize.call(this, options.collection, options.date, options);
    },
    
    preRender: function () {
      this.setView(new Qorus.TableView({
        template: TableTpl,
        row_template: RowTpl,
        collection: this.collection
      }), '#classes');
    }
  });
  
  return View;
});
