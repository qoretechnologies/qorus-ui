define([
  'jquery',
  'underscore',
  'backbone',
], function ($, _, Backbone) {
  var routes = {
    // Define some URL routes
    'workflows/view/:id(/:inst)(/)(:filter)(/)(:date)(/)(:wfiid)': 'showWorkflow',
    'workflows/:date(/)(:deprecated)': 'showWorkflows',
    'workflows': 'showWorkflows',

    'orders/view/:id': 'showOrder',
    'service/view/:id': 'showServices',
    'services': 'showServices',
    'jobs/view/:id(/:date)': 'showJob',
    'jobs/:date': 'showJobs',
    'jobs': 'showJobs',
    'events': 'showEvents',
    'search(/)(:ids)(/)(:keyvalues)': 'showSearch',
    'system': 'showSystem',
    'ocmd': 'showOcmd',
    'groups/:name': 'showGroup',
    'groups': 'showGroups',
    'extensions(/)(:extension)': 'showExtension',
    'functions': 'showFunctions',
    '': 'redirectToDashboard',

    // Default
    '*actions': 'defaultAction'
  }

  var _urls = function () {
    var rts = _.invert(routes);
    _.each(rts, function(route, k){
      // remove optional paramaters
      route = route.replace(/\(.*$/, '');
      route = route.replace(/(\:)(.*)/, '%(\$2)s');
      rts[k] = "/" + route;
    });
    return rts;
  }
  
  var urls = new _urls;
  
  return {
    routes: routes,
    urls: urls
  };
});