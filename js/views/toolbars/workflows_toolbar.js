define([
  'jquery',
  'underscore',
  'utils',
  'views/toolbars/toolbar',
  'text!templates/workflow/toolbars/workflows_toolbar.html',
], function($, _, utils, BaseToolbar, Template){
  
  var Toolbar = BaseToolbar.extend({
    datepicker: true,
    template: Template,
    context: {},
    url: '/workflows/',
    
    initialize: function (opts) {
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      this.getHiddenURL();
    },
    
    getHiddenURL: function () {
      var path = utils.getCurrentLocationPath().slice(1);
      var parts = path.split('/');
      
      debug.log(parts.length);
      
      if (parts.length > 2) {
        this.context.url = [parts[0], parts[1]].join('/');
        this.context.deprecated = true;
      } else if (parts.length == 2) {
        this.context.url = [parts[0], parts[1], 'hidden'].join('/');
        this.context.deprecated = false;
      } else {
        this.context.url = [parts[0], '24h', 'hidden'].join('/');
        this.context.deprecated = false;
      }

    }
  });
  
  return Toolbar;
});
