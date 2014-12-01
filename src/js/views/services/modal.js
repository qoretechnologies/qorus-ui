define(function (require) {
  var $         = require('jquery'),
      _         = require('underscore'),
      settings  = require('settings'),
      Qorus     = require('qorus/qorus'),
      Template  = require('tpl!templates/service/method.html'),
      yaml      = require('libs/js-yaml'),
      View;


  View = Qorus.View.extend({
    views: {},
    context: {},
    template: Template,
    additionalEvents: {
      'submit': 'executeMethod',
      'click .nav-pills a': 'tabToggle'
    },
    
    initialize: function (opts) {
      _.bindAll(this);

      this.opts = opts;      
      _.extend(this.context, opts);
    },
    
    // starts workflow with params from form
    executeMethod: function (e) {
      var $target = $(e.currentTarget);
      e.preventDefault();
      
      this.methodCall($('#service_name', $target).val(), $('#method', $target).val(), $('#args', $target).val());
      return this;
    },
    
    methodCall: function(service_name, method, args) {
      var url = [settings.REST_API_PREFIX, 'services', service_name, method].join('/');
      
      $.put(url, { action: 'call', parse_args: args })
        .always(this.updateResponse);
    },
    
    updateResponse: function (response) {
      if (_.isObject(response)) {
        response = JSON.stringify(response, null, 4);
      }
      this.$('#response-json', this.$el).text(response);
      this.$('#response-yaml', this.$el).text(yaml.dump(arguments[2].responseJSON));
      // console.log(console.log(yaml.safeDump(arguments[2].responseJSON)));
    },
    
    tabToggle: function (e) {
      var $target = $(e.currentTarget);
      
      $target.tab('show');
      e.preventDefault();
    }
    
  });
  
  return View;
});
