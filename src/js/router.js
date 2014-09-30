define(function (require) {  
  var $                 = require('jquery'),
      _                 = require('underscore'),
      utils             = require('utils'),
      Backbone          = require('backbone'),
      InfoView          = require('views/info'),
      SystemInfoView    = require('views/system'),
      Workflows         = require('collections/workflows'),
      WorkflowListView  = require('views/workflows/workflows'),
      WorkflowView      = require('views/workflows/workflow'),
      ServiceListView   = require('views/services/services'),
      JobListView       = require('views/jobs/jobs'),
      JobView           = require('views/jobs/job'),
      EventListView     = require('views/events/events'),
      SearchListView    = require('views/workflows/search'),
      OrderView         = require('views/workflows/order'),
      OcmdView          = require('views/system/ocmd'),
      ExtensionListView = require('views/extensions/extensions'),
      ExtensionView     = require('views/extensions/extension'),
      FunctionListView  = require('views/functions/functions'),
      GroupsView        = require('views/groups/groups'),
      GroupView         = require('views/groups/group'),
      Urls              = require('urls'),
      Notifications     = require('collections/notifications'),
      Alerts            = require('collections/alerts'),
      Constants         = require('collections/constants'),
      Functions         = require('collections/functions'),
      Qorus             = require('qorus/views'),
      Library           = require('collections/library'),
      LibraryView       = require('views/library/library'),
      OrdersCollection  = require('collections/orders'),
      // LocalSettings  = require('models/setting'),
      AppRouter, app_router, alerts;
      
  require('backbone.identity');
  require('messenger');

  
  // fetch local notifications
  Notifications.fetch();

  // fetch alerts
  Alerts.fetch();
  Constants.fetch();

  AppRouter = Backbone.Router.extend({
    currentView: null,
    routes: Urls.routes,
    views: {},
    collections: {},
        
    // cleans viewport from zombies
    clean: function () {
      debug.log('cleaning', this.currentView);
      if (this.currentView) {
        debug.log('cleaning current view');
        this.currentView.close();
        this.currentView.remove();
        this.currentView = null;
      }
    },
    
    // resets current view
    setView: function (view) {
      this.clean();
      this.currentView = view;
      view.$el.appendTo('#content');
    },
    
    // redirects to workflows page
    redirectToWorkflows: function() {
      Backbone.history.navigate('/workflows', { trigger: true });
    },
    
    // workflow list 
    showWorkflows: function (date, deprecated, path, query) {
      var opts = {
            date: utils.prepareDate(date),
            path: path,
            deprecated: deprecated || false,
            query: query,
            fetch: false
          },
          view, d = (deprecated === 'hidden');
      
      if (!this.collections.workflows) {
        this.collections.workflows = new Workflows([], opts);
        this.listenToOnce(this.collections.workflows, 'sync', function (col) {
          var array = [];
          var args = array.slice.call(arguments, 0);
          args.unshift('firstsync');
          col.trigger.apply(col, args)
        });
      } else {
        d = this.collections.workflows.opts.deprecated;
        _.extend(this.collections.workflows.opts, opts);
        this.collections.workflows.trigger('change:date', date);
      }
      
      this.collections.workflows.fetch();
      
      if (!(this.currentView instanceof WorkflowListView)) {
        view = new WorkflowListView(this.collections.workflows, opts);
        this.setView(view);
      }
      
      var dd = (deprecated === null) ? false : deprecated;
      
      if (d !== dd) {
        var tview = this.currentView.getView('.workflows');
        this.currentView.opts.deprecated = dd;
        this.currentView.render();
      }
    },
    
    // workflow detail
    showWorkflow: function (id, inst, filter, date) {
      var view = new WorkflowView({ id: id, inst: inst, filter: filter, date: date });
      this.setView(view);
    },

    // servicee list
    showServices: function (path, query) {
      var view = new ServiceListView({ path: path, query: query });
      this.setView(view);
    },
    
    showService: function (id) {
      this.showServices(id);
    },
    
    // job list
    showJobs: function (date, path, query) {
      var view = new JobListView({}, { date: date, path: path, query: query }, this);
      this.setView(view);
    },
    
    // result list
    showJob: function (id, filter, date) {
      var view = new JobView({ jobid: id, filter: filter, date: date });
      this.setView(view);
    },
    
    // event list
    showEvents: function () {
      var view = new EventListView();
      this.setView(view);
    },
    
    // search
    showSearch: function (ids, keyvalues) {
      var collection = new OrdersCollection([], { ids: ids, keyvalue: keyvalues }),
          view;
    
      collection.fetch();
      view = new SearchListView({ search: { ids: ids, keyvalues: keyvalues }, collection: collection });
      this.setView(view);
    },
    
    // order detail
    showOrder: function (id, path){
      var view = new OrderView({ id: id, path: path });
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
      var view, query; 
      
      if (!extension) {
        view = new ExtensionListView();
      } else {
        query = window.location.search.slice(1);
        debug.log(query);
        view = new ExtensionView({}, extension, query);        
      }
      this.setView(view);
    },
    
    showFunctions: function () {
      var view = new FunctionListView();
      this.setView(view);
    },
    
    showClasses: function () {
      var collection = new Library();
      var view = new LibraryView({ collection: collection });
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
  
  $(document).on("click", 'a[href]:not([href^="http://"], [href^="https://"], [href^="#"])', function(event) {
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
