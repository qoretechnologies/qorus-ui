define(function(require) {
  var BaseToolbar = require('views/toolbars/toolbar'),
      Template    = require('tpl!templates/job/toolbars/jobs_toolbar.html'),
      Toolbar;

  Toolbar = BaseToolbar.extend({
    context: {},
    template: Template,
    url: '/jobs/',
    datepicker: true,
    route: 'showJobs'
  });
  
  return Toolbar;
});
