define([
  'jquery',
  'underscore',
  'backbone',
  'settings',
  'utils',
  'text!../../templates/common/nested_list.html',
  'text!../../templates/common/nested_list_text.html',
  'text!../../templates/common/wrap_label.html',
  'text!../../templates/common/power_button.html',
  'text!../../templates/common/action_status.html',
  'urls'
], function ($, _, Backbone, settings, utils, NestedListTpl, NestedListTextTpl, WrapLabelTpl, PwrBtnTpl, StatusActionTpl, Urls) { 

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
      return _.template(tpl_html, { items: obj, css: css, createNestedList: Helpers.createNestedList, escapeHtml: Helpers.escapeHtml, preformatted: preformatted });
    },
    
    createNestedListAsText: function (obj, tpl, level) {
      var tpl_html = tpl || NestedListTextTpl;
      level = level || 0;
      var output = _.template(tpl_html, { items: obj, createNestedListAsText: Helpers.createNestedListAsText, level: level, escapeHtml: Helpers.escapeHtml });
      
      return output.replace(/\n{2,}/gm,"\n");
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
    },
    
    statusActions: function (status, data, tpl) {
      var tpl_html = tpl || StatusActionTpl;
      var context = _.extend(this, data, { status: status });
    
      // exted this context
      if (data.obj) {
        _.extend(context, data);
      }
      return _.template(tpl_html, context);
    },
    
    getActionIcon: function (action) {
      if (_.has(utils.action_icons, action)) {
        return "icon-" + utils.action_icons[action];
      }
      return '';
    },
    
    escapeHtml: function (html) {
      if (_.isString(html)) {
        var new_html;
        new_html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (html.search(/^<\?xml/) != -1) {
          return '<pre><code data-language="xml">' + new_html + '</code></pre>';
        } 
        return new_html;
      }
      return html;
    },
    
    createDiagram: function (step_list, node) {
        var n = node || $('<div class="row" />');
    
        _.each(step_list, function (step) {
            if (_.isArray(step)) {
                var sw = 12 / step.length;
                n.append(Helpers.createDiagram(step, $('<div />').addClass("span"+ sw)));
            } else {
                n.append($('<div class="row" />').text(step));
            }
        });

        return n;
    }
    
  }
  
  return Helpers
});