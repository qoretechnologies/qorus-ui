define(function (require) {
  var routes, urls,
      _ = require('underscore');
  
  routes = {
    // Define some URL routes
    'workflows/view/:id(/:inst)(/)(:filter)(/)(:date)(/)(:wfiid)': 'showWorkflow',
    'workflows(/)(:date)(/)(:deprecated)(/)*path': 'showWorkflows',

    'orders/view/:id(/)*path': 'showOrder',
    'service/view/:id': 'showService',
    'services(/)*path': 'showServices',
    'jobs/view/:id(/)(:filter)(/)(:date)': 'showJob',
    'jobs(/)(:date)(/)*path': 'showJobs',
    'events': 'showEvents',
    'search(/)(:ids)(/)(:keyvalues)': 'showSearch',
    'system(/)*path': 'showSystem',
    'ocmd': 'showOcmd',
    'groups/:name': 'showGroup',
    'groups': 'showGroups',
    'extensions(/)(:extension)': 'showExtension',
    'functions': 'showFunctions',
    '': 'redirectToDashboard',

    // Default
    '*actions': 'defaultAction'
  };

  urls = function () {
    var rts = _.invert(routes);
    _.each(rts, function(route, k){
      // remove optional paramaters
      route = route.replace(/\(|\)/g, '').replace(/(\:)(\w+)/g, '%($2)s').replace(/(\*\w+)/, '');
      rts[k] = "/" + route;
    });
    return rts;
  };  
  
  return {
    routes: routes,
    urls: new urls()
  };
});