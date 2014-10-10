define(function (require) {
  var $           = require('jquery'),
      _           = require('underscore'),
      BaseToolbar = require('views/toolbars/toolbar'),
      Template    = require('tpl!templates/service/toolbars/service_toolbar.html'),
      CopyView    = require('views/common/table.copy');

  var csv_options = {
    el: '#service-list table',
    ignore: [0,2,4]
  };
  
  var Toolbar = BaseToolbar.extend({
    context: {},
    template: Template,
    postInit: function () {
      this.setView(new CopyView({ csv_options: csv_options, css_class: 'btn-small' }), '#table-copy');
    }
  });
  return Toolbar;
});
