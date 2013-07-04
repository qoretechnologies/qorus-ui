define([
  'jquery',
  'underscore',
  'utils',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/jobs',
  'text!../../../templates/job/list.html',
  'text!../../../templates/job/table.html',
  'text!../../../templates/job/row.html',
  'views/toolbars/jobs_toolbar',
  'views/jobs/modals/reschedule',
  'views/jobs/modals/expire'
], function($, _, utils, Qorus, Dispatcher, Collection, Template, TableTpl, RowTpl, Toolbar, RescheduleModal, ExpireModal){

  var ListView = Qorus.ListView.extend({
    title: "Jobs",
    model_name: 'job',
    
    additionalEvents: {
      'click a[data-action="set-expiry"]': 'setExpiration',
      'click a[data-action="schedule"]': 'reSchedule'
    },
    
    initialize: function (collection, date) {
      this.template = Template;
      
      // pass date to options object
      this.date = date;
      
      ListView.__super__.initialize.call(this, Collection, date);
      
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
      this.subviews.toolbar = new Toolbar({ date: this.date });
    },

    onRender: function () {
      this.assign('#job-list', this.subviews.table); 
      this.assign('#job-toolbar', this.subviews.toolbar);
    },
    
    reSchedule: function (ev) {
      var $target = $(ev.currentTarget);
      var job = this.collection.get($target.data('id'));
      var view = new RescheduleModal({ job: job });
      
      if (this.subviews.modal) {
        this.subviews.modal.off();
      }
      
      this.subviews.modal = view;
      this.assign('#jobs-modal', view);
      
      ev.preventDefault();
    },
    
    setExpiration: function (ev) {
      var $target = $(ev.currentTarget);
      var job = this.collection.get($target.data('id'));
      var view = new ExpireModal({ job: job });
      
      if (this.subviews.modal) {
        this.subviews.modal.off();
      }
      
      this.subviews.modal = view;
      this.assign('#jobs-modal', view);
      
      ev.preventDefault();
    },    // 
    // 
    // highlight: function (ev) {
    //   this.showActionToolbar
    //   ListView.__super__.highlight(ev);
    // },
    
    // override the parent runAction to prevent run it on set-expiry and schedule
    runAction: function (ev) {
      var $target = $(ev.currentTarget);
      var action = $target.data('action');
      
      if (action == 'set-expiry' || action == 'schedule') {
        ev.preventDefault();
      } else {
        ListView.__super__.runAction.call(this, ev);
      }
    },
    
    helpers: {
      getUrl: function (id, date) {
        var date = date || this.date || null;
        var params = ['/jobs/view', id];
    
        if (date) {
          params.push(utils.encodeDate(date));
        }
        
        return params.join('/');
      }
    }
  });

  return ListView;
});
