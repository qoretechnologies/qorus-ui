define(function (require) {
  var $                 = require('jquery'),
      _                 = require('underscore'),
      Qorus             = require('qorus/qorus'),
      settings          = require('settings'),
      Template          = require('text!templates/system/http.html'),
      http_services_url = settings.REST_API_PREFIX + '/system/userhttp',
      View;

  View = Qorus.View.extend({
    views: {},
    template: Template,
    
    initialize: function () {
      var self = this;
      this.views = {};
      this.context = {};
      this.options = {};
      
      $.get(http_services_url).done(function (data) {
        self.data = data;
        self.trigger('fetch');
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
