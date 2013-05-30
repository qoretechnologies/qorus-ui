define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/jobs',
  'text!../../../templates/job/list.html',
  'text!../../../templates/job/table.html',
  'text!../../../templates/job/row.html',
], function($, _, Qorus, Dispatcher, Collection, Template, TableTpl, RowTpl){

  var ListView = Qorus.ListView.extend({
    title: "Jobs",
    model_name: 'job',
    
    additionalEvents: {
      "click button[data-action]": "runAction",
    },
    
    initialize: function () {
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
      
      this.createSubviews();
      this.bindEvents();
    },
  
    createSubviews: function () {
      this.subviews.table = new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          dispatcher: Dispatcher
      });
    },
    
    bindEvents: function () {
        this.listenToOnce(this.collection, 'sync', this.render);
    },
    
    unbindEvents: function () {
      _.each(this.collection.models, function (model) {
        model.stopListening(Dispatcher);
      });
    },
    
    clean: function () {
      this.unbindEvents();
    },
    
    onRender: function () {
      this.assign('#job-list', this.subviews.table); 
    },
    
    runAction: function (e) {
      e.stopPropagation();
      
      console.log('Running action', e);
      
      var $target = $(e.currentTarget);
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        $target.text(data.msg.toUpperCase());
        var inst = this.collection.get(data.id);
        inst.doAction(data.action); 
      }
    }
    
  });

  return ListView;
});
