define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/jobs',
  'text!../../../templates/job/list.html',
  'text!../../../templates/job/table.html',
  'text!../../../templates/job/row.html',
  'views/toolbars/jobs_toolbar'
], function($, _, Qorus, Dispatcher, Collection, Template, TableTpl, RowTpl, Toolbar){

  var ListView = Qorus.ListView.extend({
    title: "Jobs",
    model_name: 'job',
    
    additionalEvents: {
      'click a[data-action="set-expiry"]': 'setExpiration',
      'click a[data-action="schedule"]': 'reSchedule',
      "click a[data-action]": "runAction",
    },
    
    initialize: function () {
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
      
      this.createSubviews();
      this.listenToOnce(this.collection, 'sync', this.render);

      this.listenTo(Dispatcher, 'job:instance_start job:instance_stop', this.updateModels);    
    },
  
    createSubviews: function () {
      this.subviews.table = new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          dispatcher: Dispatcher
      });
      this.subviews.toolbar = new Toolbar();
    },

    onRender: function () {
      this.assign('#job-list', this.subviews.table); 
      this.assign('#job-toolbar', this.subviews.toolbar);
    },
    
    runAction: function (e) {
      e.stopPropagation();
      
      var $target = $(e.currentTarget);
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        
        // update text message
        if (data.msg) {
          $target.text(data.msg.toUpperCase());          
        }

        var inst = this.collection.get(data.id);
        inst.doAction(data.action); 
      }
    },
    
    reSchedule: function (ev) {
      console.log("reschedule", ev);
      ev.stopPropagation();
      ev.preventDefault();
    },
    
    setExpiration: function (ev) {
      console.log('set expiry', ev);
      ev.stopPropagation();
      ev.preventDefault();
    },
    
    highlight: function (ev) {
      this.showActionToolbar
      ListView.__super__.highlight(ev);
    }
    
    
  });

  return ListView;
});
