define([
  'jquery',
  'underscore',
  'backbone',
  'settings',
  'utils',
  'tpl!../../templates/common/nested_list.html',
  'tpl!../../templates/common/nested_list_text.html',
  'tpl!../../templates/common/wrap_label.html',
  'tpl!../../templates/common/power_button.html',
  'tpl!../../templates/common/action_status.html',
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
      return WrapLabelTpl({ value: status, label: this.getStatusCSS(status) });
    },

    createNestedList: function (obj, css, tpl, preformatted) {
      var tpl_html = NestedListTpl;

      if (tpl) {
        tpl_html = _.template(tpl);
      }

      return tpl_html({ items: obj, css: css, createNestedList: Helpers.createNestedList, escapeHtml: Helpers.escapeHtml, preformatted: preformatted });
    },
    
    createNestedListAsText: function (obj, tpl, level) {
      var tpl_html = NestedListTextTpl,
        output;
      level = level || 0;

      if (!_.isUndefined(tpl)) {
        tpl_html = _.template(tpl);
      }

      output = tpl_html({ items: obj, createNestedListAsText: Helpers.createNestedListAsText, level: level, escapeHtml: Helpers.escapeHtml });
      
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
      var tpl_html = PwrBtnTpl;

      if (!_.isUndefined(tpl)) {
        tpl_html = _.template(tpl);
      }
      
      return tpl_html({ status: status, data: data });
    },

    getUrl: function (route, params) {
      var urls = Urls.urls;
      return sprintf(urls[route], params);
    },
    
    statusActions: function (status, data, tpl) {
      var tpl_html = tpl || StatusActionTpl,
        context = _.extend(this, data, { status: status });
    
      if (!_.isUndefined(tpl)) {
       tpl_html = _.template(tpl);
      }
    
      // exted this context
      if (data.obj) {
        _.extend(context, data);
      }
      return tpl_html(context);
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
    },
    
    nl2br: function (text) {
      if (_.isString(text)) {
        return text.replace(/\n/gi,'<br />');
      }
      return text;
    }
    
  }
  
  return Helpers
});