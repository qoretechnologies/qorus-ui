/*global window, console, define */
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
  'collections/events',
  'views/events/events',
  'views/workflows/orders',
  'views/workflows/search',
  'views/workflows/order',
  'messenger'
], function($, _, Backbone, moment, messenger, Qorus, SystemInfoView, WorkflowListView, WorkflowView, 
  ServiceListView, JobListView, InstanceListView, EventCollection, EventListView, OrderListView, SearchListView,
  OrderView) {

  window.qorusEventCollection = new EventCollection();
  window.qorusDispatcher = new Qorus.Dispatcher();
    
  var AppRouter = Backbone.Router.extend({
    initialize: function(){
      this.currentView = null;
    },
    routes: {
      // Define some URL routes
      'workflows/view/:id(/:inst)(/)(:filter)(/)(:date)(/)(:wfiid)': 'showWorkflow',
      'workflows/:date': 'showWorkflows',
      'workflows': 'showWorkflows',

      'orders/view/:wfiid': 'showOrder',

      'services': 'showServices',
      'jobs': 'showJobs',
      'events': 'showEvents',
      'search(/)(:ids)(/)(:keyvalues)': 'showSearch',
      // 'system': 'showSystem',
      '': 'redirectToWorkflows',

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
      $('#content').html(view.el);
    },
    redirectToWorkflows: function() {
      Backbone.history.navigate('#/workflows');
    },
    showWorkflows: function(date){
      var view = new WorkflowListView({}, date, this);
      this.setView(view);
    },
    showWorkflow: function(id, inst, filter, date, wfiid) {
      if (wfiid){
        this.showOrder(wfiid, id);
      } else {
        var view = new WorkflowView({ id: id, inst: inst, filter: filter, date: date });
        this.setView(view);        
      }
    },
    showServices: function() {
      var view = new ServiceListView();
      this.setView(view);
    },
    showJobs: function() {
      var view = new JobListView();
      this.setView(view);
    },
    showEvents: function() {
      var view = new EventListView(window.qorusEventCollection);
      this.setView(view);
    },
    showSearch: function(ids, keyvalues) {
      var view = new SearchListView({ search: { ids: ids, keyvalues: keyvalues } });
      this.setView(view);
    },
    showOrder: function(wfiid, id){
      var view = new OrderView({ id: wfiid, workflow_id: id });
      this.setView(view);
    },
    defaultAction: function(actions) {
      this.clean();
      console.log('No route:', actions);
    }
  });

  new SystemInfoView();

  var app_router = new AppRouter();
  
  app_router.on('route', function(){
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
  // Backbone.history.start();
  return app_router;
});
