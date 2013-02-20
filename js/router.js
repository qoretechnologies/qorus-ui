define([
  'jquery',
  'underscore',
  'backbone',
  'views/workflows/workflows',
  'views/workflows/workflow',
  'views/services/services',
  'views/jobs/jobs',
  'views/workflows/instances',
], function($, _, Backbone, WorkflowListView, WorkflowView, ServiceListView, JobListView, InstanceListView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'workflows': 'showWorkflows',
	  'workflows/:id': 'showWorkflow',
	  'services': 'showServices',
	  'jobs': 'showJobs',
	  // 'system': 'showSystem',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    app_router.on('route:showWorkflows', function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      var workflowListView = new WorkflowListView();
	  workflowListView.render();
    });
	app_router.on('route:showWorkflow', function(id){
	  var workflowView = new WorkflowView({id: id});
	  workflowView.render();
	});
    app_router.on('route:showServices', function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      var serviceListView = new ServiceListView();
	  serviceListView.render();
    });
    app_router.on('route:showJobs', function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      var jobListView = new JobListView();
	  jobListView.render();
    });
    app_router.on('route:defaultAction', function(actions){
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    });
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});