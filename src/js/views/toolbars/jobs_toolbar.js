define(function(require) {
  var BaseToolbar = require('views/toolbars/toolbar'),
      Template    = require('tpl!templates/job/toolbars/jobs_toolbar.html'),
      CopyView    = require('views/common/table.copy'),
      Toolbar;

  var csv_options = {
    el: '#job-list table',
    ignore: [0,1,2,12,13]
  };
  
  Toolbar = BaseToolbar.extend({
    context: {},
    template: Template,
    url: '/jobs/',
    datepicker: true,
    route: 'showJobs',
    postInit: function () {
      this.setView(new CopyView({ csv_options: csv_options }), '#table-copy');
    }
  });
  
  return Toolbar;
});
