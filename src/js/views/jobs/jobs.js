define(function(require) {
  var $               = require('jquery'),
      Backbone        = require('backbone'),
      utils           = require('utils'),
      helpers         = require('qorus/helpers'),
      Qorus           = require('qorus/qorus'),
      Collection      = require('collections/jobs'),
      Template        = require('text!templates/job/list.html'),
      TableTpl        = require('text!templates/job/table.html'),
      RowTpl          = require('text!templates/job/row.html'),
      Toolbar         = require('views/toolbars/jobs_toolbar'),
      RescheduleModal = require('views/jobs/modals/reschedule'),
      ExpireModal     = require('views/jobs/modals/expire'),
      PaneView        = require('views/common/pane'),
      DetailView      = require('views/jobs/detail'),
      ListView, RowView;
      

  RowView = Qorus.RowView.extend({
    template: RowTpl,
    additionalEvents: {
      'click [data-action]': 'runAction'
    },
    runAction: function (evt) {
      var data = evt.currentTarget.dataset;
      // if setExpiration or reSchedule propagate the event to parent view
      if (data.action === 'set-expiry' || data.action === 'schedule') return;
      var $target = $(evt.currentTarget);
      
      this.model.doAction($target.data('action'), $target.data());
      this.$('.btn-group.open').dropdown('toggle');
      evt.stopPropagation();
    }
  });
    
  ListView = Qorus.ListView.extend({
    title: "Jobs",
    model_name: 'job',
    template: Template,

    url: function () {
      return helpers.getUrl('showJobs', { date: utils.encodeDate(this.date) });
    },
    
    additionalEvents: {
      'click a[data-action="set-expiry"]': 'setExpiration',
      'click a[data-action="schedule"]': 'reSchedule'
    },
    
    initialize: function (collection, options) {
      ListView.__super__.initialize.call(this, Collection, options.date);

      this.views = {};
      this.opts = options || {};
      this.context = {};
      
      this.template = Template;
      
      this.processPath(this.opts.path);
    },
    
    onProcessPath: function (path) {
      var id = path.split('/')[0];
      
      if (id) this.detail_id = id;
    },
    
    preRender: function () {
      var TView;
      
      TView = this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          row_view: RowView,
          helpers: this.helpers,
          fixed: true
      }), '#job-list');
      
      this.listenTo(TView, 'row:clicked', this.showDetail);
      this.listenTo(TView, 'update', this.applySearch);
      
      this.setView(new Toolbar({ date: this.date }), '#job-toolbar');
    },

    reSchedule: function (ev) {
      var $target = $(ev.currentTarget);
      var job = this.collection.get($target.data('id'));

      this.setView(new RescheduleModal({ job: job }), '#jobs-modal', true).render();
			
      ev.preventDefault();
    },
    
    setExpiration: function (ev) {
      var $target = $(ev.currentTarget);
      var job = this.collection.get($target.data('id'));

      this.setView(new ExpireModal({ job: job }), '#jobs-modal', true).render();
      
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
    
    showDetail: function (row) {
      var model = row.model,
          view  = this.getView('#job-detail'),
          left  = this.$('[data-sort="version"]').offset() && this.$('[data-sort="version"]').offset().left,
          width = left ? $(document).width() - left : 400,
          url   = this.getViewUrl();
      
      if (this.selected_model != model) {
        row.$el.addClass('info');
        var cv = new DetailView({ model: model });
        view = this.setView(new PaneView({
          content_view: cv,
          width: width
        }), '#job-detail', true);
        this.selected_model = model;
        
        view.render();

        this.listenTo(this.selected_model, 'change', view.render);
        
        this.listenToOnce(view, 'closed off', function () {
          row.$el.removeClass('info');
        });
        url = this.getViewUrl() + '/' + row.model.id;
      } else {
        if (view) view.closeView();
        if (this.selected_model) this.stopListening(this.selected_model);
        
        this.selected_model = null;
      }
      
      Backbone.history.navigate(url);
    }
  });

  return ListView;
});