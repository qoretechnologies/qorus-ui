define(function (require) {
  var _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/common/taskbaricon.html'),
      IconView, Icon;
      
  require('bootstrap');
  
  Icon = Qorus.View.extend({
    icon: 'icon-question-sign',
    icon_type: 'fa-icon',
    icon_class: '',
    
    initialize: function () {
      Icon.__super__.initialize.apply(this, arguments);
      this.icon = this.options.icon || this.icon;
      this.icon_type = this.options.icon_type || this.icon_type;
      this.icon_class = this.options.icon_class || this.icon_class;
    },
    
    getIcon: function () {
      if (this.icon_type === 'fa-icon') {
        return '<i class="'+ this.icon +' '+ _.result(this, 'icon_class') +' icon-large"></i>';
      } else if (this.icon_type === 'fa-icon-sign') {
        var html = '<span class="icon-stack">';
        html += '<i class="icon-sign-blank icon-stack-base '+ _.result(this, 'icon_class') +'"></i>';
        html += '<i class="'+ this.icon +'"></i>';
        html += '</span>';
        return html;
      } else if (this.icon_type === 'image') {
        return '<img src="'+ this.icon +'" class="'+ _.result(this, 'icon_class') +'" />';
      } else if (this.icon_type === 'html') {
        return this.icon;
      }
      return '';
    },
    
    render: function () {
      this.$el.html(this.getIcon());
    }
  });
  
  IconView = Qorus.View.extend({
    tagName: 'li',
    className: 'taskbar-icon',
    template: Template,
    additionalEvents: {
      'click .taskbar-icon-image': 'showDetailView'
    },
    initialize: function (opts) {
      var icon_opts;
      
      IconView.__super__.initialize.apply(this, arguments);
      
      if (this.detail_view) {
        this.initDetailView(new this.detail_view());
      }
      
      icon_opts = _.pick(this, ['icon', 'icon_class', 'icon_type']);
      
      this.setView(new Icon(_.extend(icon_opts, opts)), '.taskbar-icon-image');
    },
    initDetailView: function (view) {
      this.setView(view, '.taskbar-icon-detail');
    },
    showDetailView: function () {
      
    }
  });
  
  return IconView;
});
