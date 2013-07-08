define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'qorus/helpers',
  'settings',
  'text!../../../templates/system/ocmd.html'
], function($, _, Backbone, Qorus, Helpers, settings, Template){
  var url = settings.REST_API_PREFIX + '/system/api';

  var View = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      'submit': 'doAction',
      'keypress input[type=text]': 'doAction'
    },
    
    initialize: function (opts) {
      this.template = Template;
      this.render();
      $(window).bind("resize.app", _.bind(this.setHeight, this));
    },
    
    onRender: function () {
      $('#command', this.$el).focus();
      this.setHeight();
    },
    
    doAction: function (e) {
      var _this = this;
      
      if (e.keyCode == 13) {
        var cmd = $('#command').val();
        var params = { 
          action: "call",
          method: cmd.split(/\s+/, 1)[0],
          parse_arg: cmd.split(/\s+/, 1)[1]
        };
      
        $('#command').val('');
        _this.addResponse(params.method);
      
        $.put(url, params)
          .done(function (data) {
            _this.addResponse(data);
          })
          .fail(function (data) {
            console.log(data);
            var resp = JSON.parse(data.responseText);
            
            _this.addResponse("<span class=\"error\">" + resp.desc + "</span>");
          });
      }
    },
    
    addResponse: function (resp) {
      if (_.isObject(resp)) {
        resp = Helpers.createNestedList(resp);
      }
      $('#output', this.$el).append("&gt;&gt;&gt " +resp + "<br />");
      
      $('#output').scrollTop($('#output')[0].scrollHeight);
    },
    
    setHeight: function () {
      var h = $(window).height();
      $('#output', this.$el).height(h-100);
    },
    
    remove: function() {
        // unbind the namespaced event (to prevent accidentally unbinding some
        // other resize events from other code in your app
        // in jQuery 1.7+ use .off(...)
        $(window).unbind("resize.app");
        // don't forget to call the original remove() function
        Backbone.View.prototype.remove.call(this);
    }
    
  });
  
  return View;
});