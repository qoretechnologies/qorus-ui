define(function(require) {
  var $               = require('jquery'),
      _               = require('underscore'),
      utils           = require('utils'),
      helpers         = require('qorus/helpers'),
      Qorus           = require('qorus/qorus'),
      Dispatcher      = require('qorus/dispatcher'),
      Collection      = require('collections/jobs'),
      Template        = require('text!templates/job/list.html'),
      TableTpl        = require('text!templates/job/table.html'),
      RowTpl          = require('text!templates/job/row.html'),
      Toolbar         = require('views/toolbars/jobs_toolbar'),
      RescheduleModal = require('views/jobs/modals/reschedule'),
      ExpireModal     = require('views/jobs/modals/expire'),
      PaneView        = require('views/common/pane'),
      DetailView      = require('views/jobs/detail'),
      ListView, TableView;
    
  ListView = Qorus.ListView.extend({
    title: "Jobs",
    model_name: 'job',

    url: function () {
      return helpers.getUrl('showJobs', { date: utils.encodeDate(this.date) });
    },
    
    additionalEvents: {
      'click a[data-action="set-expiry"]': 'setExpiration',
      'click a[data-action="schedule"]': 'reSchedule'
    },
    
    initialize: function (collection, date) {
      _.bindAll(this);
      this.template = Template;
      
      // pass date to options object
      this.date = date;
      
      ListView.__super__.initialize.call(this, Collection, date);
      
      // this.listenToOnce(this.collection, 'sync', this.render);

      this.listenTo(Dispatcher, 'job:start job:stop job:instance_stop', this.updateModels);    
      this.processPath(this.opts.path);
    },
    
    onProcessPath: function (path) {
      var id = path.split('/')[0];
      
      if (id) this.detail_id = id;
    },
    
    onRender: function () {
      if (parseInt(this.detail_id, 10)) {
        this.collection.get(this.detail_id).trigger('rowClick');
      }
    },
    
    preRender: function () {
      var TView;
      
      TView = this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          dispatcher: Dispatcher,
          fixed: true
      }), '#job-list');
      
      this.listenTo(TView, 'row:clicked', this.showDetail);
      
      this.setView(new Toolbar({ date: this.date }), '#job-toolbar');
    },

    reSchedule: function (ev) {
      var $target = $(ev.currentTarget);
      var job = this.collection.get($target.data('id'));

      this.setView(new RescheduleModal({ job: job }), '#jobs-modal', true);
      
      ev.preventDefault();
    },
    
    setExpiration: function (ev) {
      var $target = $(ev.currentTarget);
      var job = this.collection.get($target.data('id'));

      this.setView(new ExpireModal({ job: job }), '#jobs-modal', true);
      
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
    
    updateModels: function (e, evt) {
      var m = this.collection.get(e.info.id);
      
      if (m) {
        if (evt == 'job:instance_stop') {
          m.incr(e.info.status);
        } else if (evt == 'job:start') {
          m.set('active', true);
        } else if (evt == 'job:stop') {
          m.set('active', false);
        }
        // debug.log(m.attributes);
        // m.trigger('fetch');
      }
    },
    
    showDetail: function (row) {
      var model = row.model,
          view  = this.getView('#job-detail'),
          width = $(document).width() - $('[data-sort="active"]').offset().left,
          url   = this.getViewUrl();
      
      if (this.selected_model != model) {
        row.$el.addClass('info');
        view = this.setView(new PaneView({
          content_view: new DetailView({ model: model }),
          width: width
        }), '#job-detail', true);
        this.selected_model = model;

        this.listenTo(this.selected_model, 'change', view.render);
        
        this.listenToOnce(view, 'closed off', function () {
          row.$el.removeClass('info');
        });
        url = this.getViewUrl() + '/' + row.model.id;
      } else {
        if (view) view.close();
        if (this.selected_model) this.stopListening(this.selected_model);
        
        this.selected_model = null;
      }
      
      Backbone.history.navigate(url)
    }
  });

  return ListView;
});
