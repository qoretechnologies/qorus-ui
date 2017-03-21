define(function (require) {
  var routes, urls,
      _ = require('underscore');
  
  routes = {
    // Define some URL routes
    'backbone/workflows/view/:id(/:inst)(/)(:filter)(/)(:date)(/)(:wfiid)': 'showWorkflow',
    'backbone/workflows(/)(:date)(/)(:deprecated)(/)*path': 'showWorkflows',

    'backbone/orders/view/:id(/)*path': 'showOrder',
    'backbone/service/view/:id': 'showService',
    'backbone/services(/)*path': 'showServices',
    'backbone/jobs/view/:id(/)(:filter)(/)(:date)': 'showJob',
    'backbone/jobs(/)(:date)(/)*path': 'showJobs',
    'backbone/events': 'showEvents',
    'backbone/search(/)(:ids)(/)(:keyvalues)': 'showSearch',
//    'search?*queryString': 'showSearch',
    'backbone/system(/)*path': 'showSystem',
    'backbone/ocmd': 'showOcmd',
    'backbone/groups/:name': 'showGroup',
    'backbone/groups': 'showGroups',
    'backbone/extensions(/)(:extension)': 'showExtension',
    'backbone/functions': 'showFunctions',
    'backbone/library': 'showClasses',
    'backbone/': 'redirectToDashboard',

    // Default
    '*actions': 'defaultAction'
  };
  
  console.warn('!!!!!!! CHANGES APPLIEEEEEEEEED !!!!!!');

  urls = function () {
    var rts = _.invert(routes);
    _.each(rts, function(route, k){
      // remove optional paramaters
      route = route.replace(/\(|\)/g, '').replace(/(\:)(\w+)/g, '%($2)s').replace(/(\*\w+)/, '');
      rts[k] = "/backbone/" + route;
    });
    return rts;
  };  
  
  return {
    routes: routes,
    urls: new urls()
  };
});