define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/service/modal.html'),
      View;


  View = Qorus.View.extend({
    views: {},
    context: {},
    additionalEvents: {
      'submit': 'executeMethod'
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.template = Template;

      this.opts = opts;      
      _.extend(this.context, opts);
    },
        
    onRender: function () {
      $(this.$el).modal();
    },
        
    open: function () {
      $(this.$el).modal();
    },
    
    close: function () {
      this.$el.modal('hide');
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
      
      var _this = this;
      
      $.put(url, { action: 'call', parse_args: args })
        .always( 
          function (e) {
            _this.updateResponse(e);
          }
        );
    },
    
    updateResponse: function (response) {
      if (_.isObject(response)) {
        response = JSON.stringify(response);
      }
      $('#response', this.$el).text(response);
    },
    
    off: function () {
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    }
    
  });
  
  return View;
});
