define(function(require){
  var BaseToolbar = require('views/toolbars/toolbar'),
      Template    = require('text!templates/events/toolbars/events_toolbar.html'),
      Toolbar;
  
  Toolbar = BaseToolbar.extend({
    datepicker: true,
    template: Template,
    context: {},
  });
  
  return Toolbar;
});
