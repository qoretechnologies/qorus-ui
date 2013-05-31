define([
  'jquery',
  'underscore',
  'backbone',
  'settings',
  'utils',
  'text!../../templates/common/nested_list.html',
  'text!../../templates/common/wrap_label.html',
  'text!../../templates/common/power_button.html',
  'urls'
], function ($, _, Backbone, settings, utils, NestedListTpl, WrapLabelTpl, PwrBtnTpl, Urls) { 
  console.log(Urls);

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
    createNestedList: function (obj, css, tpl, preformatted) {
      var tpl_html = tpl || NestedListTpl;
      return _.template(tpl_html, { items: obj, css: css, createNestedList: Helpers.createNestedList, preformatted: preformatted });
    },
    statusIcon: function(status) {
      if (status === true) {
        return '<i class="icon icon-ok-sign icon-success"></i>';
      } else {
        return '<i class="icon icon-minus-sign icon-error"></i>';
      }
    },
    powerButton: function (status, data, tpl) {
      var tpl_html = tpl || PwrBtnTpl;
      return _.template(tpl_html, { status: status, data: data });
    },
    getUrl: function (route, params) {
      var urls = Urls.urls;
      return sprintf(urls[route], params);
    }
  }
  
  return Helpers
});