define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'settings',
  'text!../../../templates/system/prop.html'
], function($, _, Backbone, Qorus, settings, Template){

  var ServiceView = Qorus.ServiceView.extend({
    name: 'prop',
    methods: {
      getData: 'get'
    },
    template: Template
  });
  
  return ServiceView;
});