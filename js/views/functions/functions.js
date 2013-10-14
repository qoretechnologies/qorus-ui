define([
  'jquery',
  'underscore',
  'utils',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/functions',
  'text!../../../templates/functions/list.html',
  'text!../../../templates/functions/table.html',
  'text!../../../templates/functions/row.html'
], function($, _, utils, Qorus, Dispatcher, Collection, Template, TableTpl, RowTpl){

  var ListView = Qorus.ListView.extend({
    title: "Functions",
    model_name: 'function',
    
    initialize: function (collection, date) {
      this.template = Template;
      
      // pass date to options object
      this.date = date;
      
      ListView.__super__.initialize.call(this, Collection, date);
      
      this.listenToOnce(this.collection, 'sync', this.render);
    },
  
    preRender: function () {
      this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          dispatcher: Dispatcher
      }), '#function-list');
    }
  });

  return ListView;
});
