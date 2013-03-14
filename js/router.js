define(['jquery', 'underscore', 'backbone', 'moment', 'qorus/qorus', 'views/system', 'views/workflows/workflows', 'views/workflows/workflow', 'views/services/services', 'views/jobs/jobs', 'views/workflows/instances', ], function($, _, Backbone, moment, Qorus, SystemInfoView, WorkflowListView, WorkflowView, ServiceListView, JobListView, InstanceListView) {
  var AppRouter = Backbone.Router.extend({
    initialize: function(opts){
      this.currentView = null;
    },
    routes: {
      // Define some URL routes
      'workflows/view/:id(/:inst)(/)(:filter)': 'showWorkflow',
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
        this.currentView.undelegateEvents();
        this.currentView.remove();
        this.currentView.off();
      }
    },
    showWorkflows: function(date){
      this.clean();
      var view = new WorkflowListView({}, date);      
      this.currentView = view;
      $('#content').html(view.el);
    },
    showWorkflow: function(id, inst, filter) {
      this.clean();
      var view = new WorkflowView({ id: id, inst: inst, filter: filter });
      this.currentView = view;
      $('#content').html(view.el);
    },
    showServices: function() {
      this.clean();
      var view = new ServiceListView();
      this.currentView = view;
      $('#content').html(view.el);
    },
    showJobs: function() {
      this.clean();
      var view = new JobListView();
      this.currentView = view;
      $('#content').html(view.el);
    },
    default: function(actions) {
      this.clean();
      console.log('No route:', actions);
    }
  });

  var systeminfoview = new SystemInfoView();

  var app_router = new AppRouter;
  

  // var initialize = function() {
  //   var loader = Qorus.Loader;
  // 
  //   app_router.on('route:showWorkflows', function(date) {
  //     var workflowListView = new WorkflowListView({}, date, app_router);
  //   });
  //   app_router.on('route:showWorkflow', function(id) {
  //     var workflowView = new WorkflowView({
  //       id: id
  //     });
  //   });
  //   app_router.on('route:showServices', function() {
  //     var serviceListView = new ServiceListView();
  //   });
  //   app_router.on('route:showJobs', function() {
  //     var jobListView = new JobListView();
  //   });
  //   app_router.on('route:defaultAction', function(actions) {
  //     // We have no matching route, lets just log what the URL was
  //     console.log('No route:', actions);
  //   });
  //   Backbone.history.start();
  // };
  
  app_router.on('route', function(e){
    // update menu and make active item based on fragment
    var fragment = Backbone.history.fragment.split('/')[0];
    $('.nav a').removeClass('active');
    $('.nav a[href*="'+ fragment +'"]').addClass('active');
  });
  
  Backbone.history.start();
  
  return app_router;
});
