define([
  'jquery',
  'underscore',
  'views/toolbars/toolbar',
  'text!templates/service/toolbars/service_toolbar.html'
], function($, _, BaseToolbar, Template){

  var Toolbar = BaseToolbar.extend({
    context: {},
    template: Template
  });
  return Toolbar;
});
