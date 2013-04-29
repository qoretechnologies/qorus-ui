define([
  'jquery',
  'underscore',
  'libs/backbone.rpc',
  'settings',
  'utils',
  'text!../../templates/common/nested_list.html',
  'text!../../templates/common/wrap_label.html'
], function ($, _, Backbone, settings, utils, NestedListTpl, WrapLabelTpl) {
  var Helpers = {
    getStatusCSS: function (status) {
      if (status) {
        status = status.toLowerCase();
        return utils.status_map[status];        
      }
    },
    wrapStatus: function (status) {
      return _.template(WrapLabelTpl, { value: status, label: this.getStatusCSS(status) });
    },
    createNestedList: function (obj, css, tpl) {
      var tpl_html = tpl || NestedListTpl;
      return _.template(tpl_html, { items: obj, css: css, createNestedList: Helpers.createNestedList });
    },
    statusIcon: function(status) {
      if (status === true) {
        return '<i class="icon icon-ok-sign icon-success"></i>';
      } else {
        return '<i class="icon icon-minus-sign icon-error"></i>';
      }
    }
  }
  
  return Helpers
});