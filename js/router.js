define(['jquery', 'underscore', 'backbone', 'moment', 'qorus/qorus', 'views/system', 'views/workflows/workflows', 'views/workflows/workflow', 'views/services/services', 'views/jobs/jobs', 'views/workflows/instances', ], function($, _, Backbone, moment, Qorus, SystemInfoView, WorkflowListView, WorkflowView, ServiceListView, JobListView, InstanceListView) {
  var AppRouter = Backbone.Router.extend({
    initialize: function(opts){
      this.currentView = null;
    },
    routes: {
      // Define some URL routes
      'workflows/view/:id(/:inst)(/)(:filter)(/)(:date)': 'showWorkflow',
      'workflows/:date': 'showWorkflows',
      'workflows': 'showWorkflows',

      'services': 'showServices',
      'jobs': 'showJobs',
      // 'system': 'showSystem',

      // Default
      '*actions': 'defaultAction'
    },
    clean: function(){
      if (this.currentView){
        this.currentView.off();
        this.currentView.undelegateEvents();
        this.currentView.remove();
      }
    },
    setView: function(view){
      if(this.currentView!=view){
        this.clean();
        this.currentView = view;
      }
    },
    showWorkflows: function(date){
      var view = new WorkflowListView({}, date, this);
      // setInterval(function() {
      //   view.collection.update();
      // }, 5000);
      this.setView(view);
      $('#content').html(view.el);
    },
    showWorkflow: function(id, inst, filter, date) {
      var view = new WorkflowView({ id: id, inst: inst, filter: filter, date: date });
      this.setView(view);
      $('#content').html(view.el);
    },
    showServices: function() {
      var view = new ServiceListView();
      this.setView(view);
      $('#content').html(view.el);
    },
    showJobs: function() {
      var view = new JobListView();
      this.setView(view);
      $('#content').html(view.el);
    },
    default: function(actions) {
      this.clean();
      console.log('No route:', actions);
    }
  });

  var systeminfoview = new SystemInfoView();

  var app_router = new AppRouter;
  
  app_router.on('route', function(e){
    // update menu and make active item based on fragment
    var fragment = Backbone.history.fragment.split('/')[0];
    $('.nav a').removeClass('active');
    $('.nav a[href*="'+ fragment +'"]').addClass('active');
  });
  
  Backbone.history.start();
  
  return app_router;
});
