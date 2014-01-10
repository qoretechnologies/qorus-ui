define(function(require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    // dualStorage = require('dualstorage'),
    localStorage = require('localstorage'),
    moment = require('moment'),
    messenger = require('messenger'),
    Qorus = require('qorus/qorus'),
    InfoView = require('views/info'),
    SystemInfoView = require('views/system'),
    WorkflowListView = require('views/workflows/workflows'),
    WorkflowView = require('views/workflows/workflow'),
    ServiceListView = require('views/services/services'),
    JobListView = require('views/jobs/jobs'),
    JobView = require('views/jobs/job'),
    InstanceListView = require('views/workflows/instances'),
    EventListView = require('views/events/events'),
    OrderListView = require('views/workflows/orders'),
    SearchListView = require('views/workflows/search'),
    OrderView = require('views/workflows/order'),
    OcmdView = require('views/system/ocmd'),
    ExtensionListView = require('views/extensions/extensions'),
    ExtensionView = require('views/extensions/extension'),
    FunctionListView = require('views/functions/functions'),
    GroupsView = require('views/groups/groups'),
    GroupView = require('views/groups/group'),
    Urls = require('urls'),
    Notifications = require('collections/notifications'),
    AppRouter, app_router;
      
    

  Messenger.options = {
  	extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
  	theme: 'qore',
    showCloseButton: true
  }

  AppRouter = Backbone.Router.extend({
    currentView: null,
    routes: Urls.routes,

    initialize: function () {
      _.bindAll(this);
      debug.log('init');
    },
        
    // cleans viewport from zombies
    clean: function () {
      debug.log('cleaning', this.currentView);
      if (this.currentView) {
        debug.log('cleaning current view');
        this.currentView.off();
        this.currentView.remove();
        delete this.currentView;
      }
    },
    
    // resets current view
    setView: function (view) {
      this.clean();
      this.currentView = view;
      // $('#content').html(view.el);
      view.$el.appendTo('#content');
    },
    
    // redirects to workflows page
    redirectToWorkflows: function() {
      Backbone.history.navigate('/workflows', { trigger: true });
    },
    
    // workflow list 
    showWorkflows: function (date, deprecated) {
      var view = new WorkflowListView({}, date, this, deprecated);
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
    showJobs: function (date) {
      var view = new JobListView({}, date, this);
      this.setView(view);
    },
    
    // result list
    showJob: function (id, date) {
      var view = new JobView({ jobid: id, date: date });
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
    
    // show group list
    showGroups: function () {
      var view = new GroupsView();
      this.setView(view);
    },
    
    // show group detail 
    showGroup: function (name) {
      var view = new GroupView({ name: name });
      this.setView(view);
    },
    
    // system detail
    showSystem: function(path) {
      var query = window.location.search.slice(1);
      var view = new SystemInfoView({ query: query, path: path});
      this.setView(view);
    },
    
    showOcmd: function () {
      var view = new OcmdView();
      this.setView(view);
    },
    
    showExtension: function (extension) {
      if (!extension) {
        var view = new ExtensionListView();
      } else {
        var query = window.location.search.slice(1);
        debug.log(query);
        var view = new ExtensionView({}, extension, query);        
      }
      this.setView(view);
    },
    
    showFunctions: function () {
      var view = new FunctionListView();
      this.setView(view);
    },
    
    showDashboard: function () {
      var view = new DashboardView();
      this.setView(view);
    },
    
    // redirects to workflows page
    redirectToDashboard: function() {
      Backbone.history.navigate('/system/dashboard', { trigger: true });
    },
    
    // default
    defaultAction: function (actions) {
      this.clean();
      debug.log('No route:', actions);
    }
  });

  new InfoView();

  app_router = new AppRouter();
  
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
