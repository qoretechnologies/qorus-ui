define([
  'jquery',
  'underscore',
  'views/toolbars/toolbar',
  'text!../../../templates/groups/toolbars/groups_toolbar.html',
], function($, _, BaseToolbar, Template){

  var Toolbar = BaseToolbar.extend({
    context: {},
    template: Template    
  });
  return Toolbar;
});
