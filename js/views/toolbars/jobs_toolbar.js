define([
  'jquery',
  'underscore',
  'views/toolbars/toolbar',
  'text!templates/job/toolbars/jobs_toolbar.html',
], function($, _, BaseToolbar, Template){

  var Toolbar = BaseToolbar.extend({
    context: {},
    template: Template,
    url: '/jobs/',
    datepicker: true   
  });
  return Toolbar;
});
