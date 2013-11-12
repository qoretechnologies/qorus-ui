define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!../../../templates/events/list.html',
  'text!../../../templates/events/table.html',
  'text!../../../templates/events/row.html',
  'qorus/events'
], function($, _, Qorus, Template, TableTpl, RowTpl, Events){
  var ListView = Qorus.ListView.extend({
    template: Template,
    
    title: "Events",
    
    initialize: function () {
      _.bindAll(this);
      Qorus.ListView.__super__.initialize.call(this);

      this.collection = Events;
      // this.listenTo(this.collection, 'update', this.render);
      _.defer(this.render);
    },
    
    preRender: function () {
      this.setView(new Qorus.TableView({ 
          messages: { 'nodata': 'Waiting for events...'},
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          context: { url: this.url },
          dispatcher: Dispatcher,
          fixed: true
      }), '#event-list');
    }
  });

  return ListView;
});
