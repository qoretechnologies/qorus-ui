define([
  'jquery',
  'underscore',
  'settings',
  'qorus/qorus',
  'text!../../../templates/service/modal.html',
], function ($, _, settings, Qorus, Template) {
  var View = Qorus.View.extend({
    context: {},
    additionalEvents: {
      'submit': 'executeMethod',
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
      e.preventDefault();
      $target = $(e.currentTarget);
      
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
      )
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