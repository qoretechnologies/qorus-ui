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
//      Functions         = require('collections/functions'),
//      Loggers           = require('collections/loggers'),
//      Qorus             = require('qorus/views'),
      Library           = require('collections/library'),
      LibraryView       = require('views/library/library'),
      OrdersCollection  = require('collections/orders'),
      React             = require('react'),
//      Filtered          = require('backbone.filtered.collection'),
      WorkflowListReact = React.createFactory(require('jsx!views.react/workflows/list.jsx')),
      ServiceListReact  = React.createFactory(require('jsx!views.react/services/list.jsx')),
      workflowsStore    = require('views.react/stores/workflows'),
      workflowsActions  = require('views.react/actions/workflows'),
      wTActions         = require('views.react/workflows/actions/table'),
      
      // LocalSettings  = require('models/setting'),
      AppRouter, app_router;
  
//  require('libs/newrelic');
  require('backbone.identity');
  require('messenger');
  require('collections/functions');
  require('collections/loggers');
  
  // fetch local notifications
  Notifications.fetch();

  // fetch alerts
  Alerts.fetch();
  Constants.fetch();
//  Loggers.fetch();

  AppRouter = Backbone.Router.extend({
    currentView: null,
    routes: Urls.routes,
    views: {},
    collections: {},
    components: {},
        
    // cleans viewport from zombies
    clean: function () {
      debug.log('cleaning', this.previousView);
      if (this.previousView) {
        debug.log('cleaning current view');
        this.previousView.close();
        this.previousView.remove();
        this.previousView = null;
      }
    },
    
    // resets current view
    setView: function (view) {
      if (this.currentView == 'react-component') {
        if (view !== 'react-component') {
          React.unmountComponentAtNode(document.getElementById('content')); 
        }
        this.previousView = null;
      } else if (this.currentView) {
        this.previousView = this.currentView;
      }
      
      this.currentView = view;
      
      if (view && view !== 'react-component') {
        view.$el.appendTo('#content');  
      }
      
      this.clean();
    },
    
    // redirects to workflows page
    redirectToWorkflows: function() {
      Backbone.history.navigate('/workflows', { trigger: true });
    },
    
    // workflow list 
    showWorkflows: function (date, deprecated, path, query) {
//      var opts = {
//            date: utils.prepareDate(date),
//            path: path,
//            deprecated: deprecated || false,
//            query: query,
//            fetch: false
//          },
//          view, d = (deprecated === 'hidden');
      
      var parts = path ? path.split('/') : [];
      
      if (!workflowsStore.getCollection()) {
        workflowsStore.setState({ 
          collection: new Workflows()
        });
      }
      
      workflowsActions.filterChange({
        deprecated: deprecated || false,
        text: query,
        date: utils.prepareDate(date)
      });
      
      if (parts.length > 0) {
        wTActions.rowClick(parseInt(parts[0]));
      }
      
      React.render(WorkflowListReact(), document.getElementById('content'));
      this.setView('react-component');
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

//    // servicee list
//    showServices: function (path, query) {
//      React.render(ServiceListReact(), document.getElementById('content'));
//      this.setView('react-component');
//    },
//    
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
    showSearch: function (ids, keyvalues, query) {
      var order_params  = _.chain(OrdersCollection.prototype.search_params).pluck('name').flatten().uniq().value(),
          search_params = _.pick(utils.parseQuery(query), order_params);
      
      var collection = new OrdersCollection([], _.extend({}, search_params, { date: '19700101'})),
          view;
    
      collection.fetch();
      view = new SearchListView({ search: search_params, collection: collection });
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
    showSystem: function (path) {
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
//      event.stopPropagation();
      var url = $(event.currentTarget).attr("href").replace(/^\//, "");
      app_router.navigate(url, { trigger: true });
      
      var el = event.target;
      
      if (el.localName !== 'a') {
        el = $(el).parents('a');
      }

      el.blur();
      return ;
    }
  });
  
  $(document).on("click", 'button', function () {
    document.activeElement.blur();
  });
  
  Backbone.history.start({ pushState: true });

  return app_router;
});