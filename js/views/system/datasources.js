define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'settings',
  'text!../../../templates/system/datasources.html'
], function($, _, Backbone, Qorus, settings, Template){
  var ServiceView = Qorus.ServiceView.extend({
    views: {},
    name: 'datasource',
    methods: {
      getData: 'showDefaults'
    },
    template: Template,
  });
  
  return ServiceView;
});