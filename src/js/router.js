define(function (require) {
  var $                  = require('jquery'),
      _                  = require('underscore'),
      utils              = require('utils'),
      Qorus              = require('qorus/qorus'),
      Backbone           = require('backbone'),
      Helpers            = require('qorus/helpers'),
      InfoView           = require('views/info'),
      SystemInfoView     = require('views/system'),
      Workflows          = require('collections/workflows'),
      WorkflowListView   = require('views/workflows/workflows'),
      WorkflowView       = require('views/workflows/workflow'),
      ServiceListView    = require('views/services/services'),
      JobListView        = require('views/jobs/jobs'),
      JobView            = require('views/jobs/job'),
      EventListView      = require('views/events/events'),
      SearchListView     = require('views/workflows/search'),
      OrderView          = require('views/workflows/order'),
      OcmdView           = require('views/system/ocmd'),
      ExtensionListView  = require('views/extensions/extensions'),
      ExtensionView      = require('views/extensions/extension'),
      FunctionListView   = require('views/functions/functions'),
      GroupsView         = require('views/groups/groups'),
      GroupView          = require('views/groups/group'),
      Urls               = require('urls'),
      Notifications      = require('collections/notifications'),
      Alerts             = require('collections/alerts'),
      Constants          = require('collections/constants'),
      WorkflowsUtils     = require('views/workflows/utils'),
      WorkflowsConstants = require('constants/workflow'),
//      Functions        = require('collections/functions'),
//      Loggers          = require('collections/loggers'),
//      Qorus            = require('qorus/views'),
      Library            = require('collections/library'),
      LibraryView        = require('views/library/library'),
      OrdersCollection   = require('collections/orders'),

      // LocalSettings  = require('models/setting'),
      AppRouter, app_router;

//  require('libs/newrelic');
  require('backbone.identity');
  require('messenger');
  require('collections/functions');
  require('collections/loggers');
//  require('piwik');


  // fetch local notifications
  Notifications.fetch();

  // fetch alerts
  Alerts.fetch();
  Constants.fetch();
//  Loggers.fetch();

    console.log(Urls, Urls.routes);

  AppRouter = Backbone.Router.extend({
    currentView: null,
    routes: Urls.routes,
    views: {},
    collections: {},
    routeHistory: [],

    initialize: function () {
      AppRouter.__super__.initialize.apply(this, arguments);
      this.on('route', this.pushHistory);
    },

    pushHistory: function (route, params) {
      var currentUrl = Backbone.history.getFragment();
      var lastUrl = _.last(this.routeHistory);

      if (lastUrl !== currentUrl) {
        this.routeHistory.push(Backbone.history.getFragment());
        this.routeHistory = _.last(this.routeHistory, 20);
      }
    },

    getLastUrl: function () {
      return _.last(this.routeHistory) || '';
    },

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
    showWorkflows: function (date, filters, path, query) {
      // console.log('deprecated', (deprecated === 'hidden'));
      var prevFilters   = [],
          getFilters    = WorkflowsUtils.getFilters,
          storedFilters = Helpers.user.getPreferences('ui.views.workflows.filters') || [];

      filters = filters ? filters.split(',') : [];

      if (filters.length === 0 && this.getLastUrl().indexOf('workflows') == -1) {
        filters = _.uniq(storedFilters.concat(filters));
      }

      var url = '/' + ['workflows', date || '24h', filters.join(',')].join('/');
      if (path) url += '/' + path;
      if (query) url += '?' + query;

      if ("/" + Backbone.history.getFragment() !== url) {
        return Backbone.history.navigate(url, { trigger: true });
      }

      var deprecated = (filters.indexOf('hidden') > -1),
          running    = (filters.indexOf('running') > -1),
          last       = (filters.indexOf('last') > -1);

      var opts = {
            date: utils.prepareDate(date),
            path: path,
            deprecated: deprecated,
            running: running,
            last: last,
            query: query,
            fetch: false
          },
          view;

      if (!this.collections.workflows) {
        this.collections.workflows = new Workflows([], opts);
        this.listenToOnce(this.collections.workflows, 'sync', function (col) {
          var array = [];
          var args = array.slice.call(arguments, 0);
          args.unshift('firstsync');
          col.trigger.apply(col, args);
        });
      } else {
        prevFilters = getFilters(this.collections.workflows.opts);
        _.extend(this.collections.workflows.opts, opts);
        this.collections.workflows.trigger('changeDate', date);
      }

      this.collections.workflows.fetch();

      if (!(this.currentView instanceof WorkflowListView)) {
        view = new WorkflowListView(this.collections.workflows, opts);
        this.setView(view);
      }

      if (prevFilters !== getFilters(opts)) {
        Helpers.user.setPreferences('ui.views.workflows.filters', getFilters(opts));
        this.currentView.getView('.workflows');
        this.currentView.opts = _.extend({}, this.currentView.opts, opts);
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
    showSearch: function (ids, keyvalues, query) {
      var order_params  = _.chain(OrdersCollection.prototype.search_params).pluck('name').flatten().uniq().value(),
          search_params = _.pick(utils.parseQuery(query), order_params);

      // hotfix search all instances not only last 24h
      search_params.date = '1970-01-01';

      var collection = new OrdersCollection([], _.clone(search_params)),
          view;

      if (ids || keyvalues || query) {
        collection.fetch();
      }

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
      var url = $(event.currentTarget).attr("href").replace(/^\//, "");
      app_router.navigate(url, { trigger: true });
      return ;
    }
  });

  Backbone.history.start({ pushState: true });

  return app_router;
});
