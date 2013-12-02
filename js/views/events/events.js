define(function(require) {
  var $          = require('jquery'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Template   = require('text!templates/events/list.html'),
      TableTpl   = require('text!templates/events/table.html'),
      RowTpl     = require('text!templates/events/row.html'),
      Events     = require('qorus/events'),
      Dispatcher = require('qorus/dispatcher'),
      ListView;
  
  ListView = Qorus.ListView.extend({
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
