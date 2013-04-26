define([
  'jquery',
  'underscore',
  'libs/backbone.rpc',
  'settings',
  'utils',
  'text!../../templates/common/nested_list.html'
], function ($, _, Backbone, settings, utils, NestedListTpl) {
  var Helpers = {
    getStatusCSS: function (status) {
      if (status) {
        status = status.toLowerCase();
        return utils.status_map[status];        
      }
    },
    createNestedList: function (obj, css, tpl) {
      var tpl_html = tpl || NestedListTpl;
      return _.template(tpl_html, { items: obj, css: css, createNestedList: Helpers.createNestedList });
    }
  }
  
  return Helpers
});