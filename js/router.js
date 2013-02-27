define(['jquery', 'underscore', 'backbone', 'moment', 'qorus/qorus', 'views/workflows/workflows', 'views/workflows/workflow', 'views/services/services', 'views/jobs/jobs', 'views/workflows/instances', ], function($, _, Backbone, moment, Qorus, WorkflowListView, WorkflowView, ServiceListView, JobListView, InstanceListView) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'workflows(/:date)': 'showWorkflows',
      'workflow/:id': 'showWorkflow',
      'services': 'showServices',
      'jobs': 'showJobs',
      // 'system': 'showSystem',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function() {
    var app_router = new AppRouter;
    var loader = Qorus.Loader;

    app_router.on('route:showWorkflows', function(date) {
      var workflowListView = new WorkflowListView(date);
      var loader = new Qorus.Loader(workflowListView.el);
      workflowListView.render();
      workflowListView.on('render', loader.remove());
      workflowListView.on('dateChanged', function(date) {
        app_router.navigate('/workflows/' + moment(date)
          .format('YYYY-MM-DD'));
      });
    });
    app_router.on('route:showWorkflow', function(id) {
      var workflowView = new WorkflowView({
        id: id
      });
      workflowView.render();
    });
    app_router.on('route:showServices', function() {
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      var serviceListView = new ServiceListView();
      serviceListView.render();
    });
    app_router.on('route:showJobs', function() {
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      var jobListView = new JobListView();
      jobListView.render();
    });
    app_router.on('route:defaultAction', function(actions) {
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    });

    app_router.on('route', function(e) {
      var hash = Backbone.history.location.hash;
      $('#nav-main li')
        .removeClass('active');
      $('#nav-main li a[href=\'' + hash + '\']')
        .parent()
        .addClass('active');
    })
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
