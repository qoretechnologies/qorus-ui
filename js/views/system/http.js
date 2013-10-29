define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'settings',
  'text!../../../templates/system/http.html'
], function($, _, Backbone, Qorus, settings, Template){
  var http_services_url = settings.REST_API_PREFIX + '/system/userhttp';

  var View = Qorus.View.extend({
    views: {},
    template: Template,
    
    initialize: function () {
      var _this = this;
      
      $.get(http_services_url).done(function (data) {
        _this.data = data;
        _this.trigger('fetch');
      });
      
      this.on('fetch', this.render);
    },
    
    render: function (ctx) {
      _.extend(this.context, { data: this.data });
      View.__super__.render.call(this, ctx);
      return this;
    }
  });
  
  return View;
});