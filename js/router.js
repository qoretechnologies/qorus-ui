define([
  'jquery', 
  'underscore', 
  'backbone', 
  'moment',
  'messenger',
  'qorus/qorus', 
  'views/system', 
  'views/workflows/workflows', 
  'views/workflows/workflow', 
  'views/services/services', 
  'views/jobs/jobs', 
  'views/workflows/instances',
  'views/events/events',
  'views/workflows/orders',
  'views/workflows/search',
  'views/workflows/order',
  'urls',
  'messenger'
], function($, _, Backbone, moment, messenger, Qorus, SystemInfoView, WorkflowListView, WorkflowView, 
  ServiceListView, JobListView, InstanceListView, EventListView, OrderListView, SearchListView,
  OrderView, Urls) {
    
  var AppRouter = Backbone.Router.extend({
    routes: Urls.routes,

    initialize: function () {
      this.currentView = null;
    },
        
    // cleans viewport from zombies
    clean: function () {
      if (this.currentView){
        this.currentView.off();
        this.currentView.undelegateEvents();
        this.currentView.remove();
      }
    },
    
    // resets current view
    setView: function (view) {
      if(this.currentView!=view){
        this.clean();
        this.currentView = view;        
      }
      $('#content').html(view.el);
    },
    
    // redirects to workflows page
    redirectToWorkflows: function() {
      console.log('Going to workflows');
      Backbone.history.navigate('/workflows', { trigger: true });
    },
    
    // workflow list 
    showWorkflows: function (date) {
      var view = new WorkflowListView({}, date, this);
      this.setView(view);
    },
    
    // workflow detail
    showWorkflow: function (id, inst, filter, date, wfiid) {
      if (wfiid) {
        this.showOrder(wfiid, id);
      } else {
        var view = new WorkflowView({ id: id, inst: inst, filter: filter, date: date });
        this.setView(view);        
      }
    },
    
    // servicee list
    showServices: function () {
      var view = new ServiceListView();
      this.setView(view);
    },
    
    // job list
    showJobs: function () {
      var view = new JobListView();
      this.setView(view);
    },
    
    // event list
    showEvents: function () {
      var view = new EventListView();
      this.setView(view);
    },
    
    // search
    showSearch: function (ids, keyvalues) {
      var view = new SearchListView({ search: { ids: ids, keyvalues: keyvalues } });
      this.setView(view);
    },
    
    // order detail
    showOrder: function (wfiid, id){
      var view = new OrderView({ id: wfiid, workflow_id: id });
      this.setView(view);
    },
    
    // default
    defaultAction: function (actions) {
      this.clean();
      console.log('No route:', actions);
    }
  });

  new SystemInfoView();

  var app_router = new AppRouter();
  
  app_router.on('route', function () {
    // update menu and make active item based on fragment
    var fragment = Backbone.history.fragment.split('/')[0];
    $('.nav a').removeClass('active');
    $('.nav a[href*="'+ fragment +'"]').addClass('active');
  });
  
  $(document).on("click", "a[href^='/']", function(event) {
    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      var url = $(event.currentTarget).attr("href").replace(/^\//, "");
      app_router.navigate(url, { trigger: true });
    }
  });
  
  Backbone.history.start({ pushState: true });

  return app_router;
});
