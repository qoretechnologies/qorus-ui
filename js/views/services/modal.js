define([
  'jquery',
  'underscore',
  'settings',
  'qorus/qorus',
  'models/method',
  'text!../../../templates/service/modal.html',
], function ($, _, settings, Qorus, ModelFunction, Template) {
  var View = Qorus.View.extend({
    context: {},
    additionalEvents: {
      'submit': 'executeMethod',
    },
    
    initialize: function (opts) {
      _.bindAll(this, 'render');
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
      
      this.methodCall($('#service_name', $target).val(), $('#method', $target).val(), $('#arguments', $target).val());
      return this;
    },
    
    methodCall: function(service_name, method, args) {
      var url = [settings.REST_API_PREFIX, 'services', service_name, method].join('/');
      
      var _this = this;
      
      $.put(url, { action: 'call', args: args })
      .done( 
        function (e, ee) {
          _this.updateResponse(e, ee);
        }
      )
    },
    
    updateResponse: function (e, ee) {
      $('#response', this.$el).html(e);
    }
    
  });
  return View;
});