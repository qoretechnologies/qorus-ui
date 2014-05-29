define(function(require) {
  var BaseToolbar = require('views/toolbars/toolbar'), 
      Template = require('tpl!templates/groups/toolbars/groups_toolbar.html'),
      Toolbar;

  Toolbar = BaseToolbar.extend({
    context: {},
    template: Template
  });
  
  return Toolbar;
});
