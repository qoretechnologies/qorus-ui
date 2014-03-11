define(function( require) {
  var $          = require('jquery'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Template   = require('text!templates/events/list.html'),
      TableTpl   = require('text!templates/events/table.html'),
      RowTpl     = require('text!templates/events/row.html'),
      Events     = require('collections/events'),
      Toolbar    = require('views/toolbars/events_toolbar'),
      ListView;
  
  
  ListView = Qorus.ListView.extend({
    template: Template,
    
    title: "Events",
    
    additionalEvents: {
      'click button#clear': 'clearStorage'
    },
    
    initialize: function () {
      this.views = {};
      _.bindAll(this);
      Qorus.ListView.__super__.initialize.call(this);

      this.collection = Events;
      // this.listenTo(this.collection, 'sync', this.render);
      _.defer(this.render);
    },
    
    preRender: function () {
      var view = this.setView(new Qorus.TableView({ 
          messages: { 'nodata': 'Waiting for events...'},
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          context: { url: this.url },
          dispatcher: Dispatcher,
          fixed: true
      }), '#event-list');
      
      this.setView(new Toolbar(), '#events-toolbar');

      // remove default listeners and assign new ones
      view.stopListening(this.collection, 'add');
      view.stopListening(this.collection, 'sync');
      view.listenToOnce(this.collection, 'sync', this.render);
      view.listenTo(this.collection, 'queue:empty', function (models) {
        view.appendRows(models);
      });
    },
    
    clearStorage: function () {
      // console.log('emptying');
      this.collection.empty();
    }
  });

  return ListView;
});
