define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'settings',
  'text!../../../templates/system/http.html'
], function($, _, Backbone, Qorus, settings, Template){

  var View = Qorus.View.extend({
    template: Template
    
    initialize: function () {
      
    }
  });
  
  return View;
});