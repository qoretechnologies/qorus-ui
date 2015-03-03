define(function (require) {
  var $ = require('jquery'),
      _ = require('underscore'),
      utils = require('utils'),
      Qorus = require('qorus/qorus'),
      Dispatcher = require('qorus/dispatcher'),
      Collection = require('collections/functions'),
      Template = require('text!templates/functions/list.html'),
      TableTpl = require('text!templates/functions/table.html'),
      RowTpl = require('text!templates/functions/row.html'),
      ListView;

  ListView = Qorus.ListView.extend({
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
