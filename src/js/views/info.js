define(function (require) {
  var $          = require('jquery'),
      _          = require('underscore'),
      Qorus      = require('qorus/qorus'),
      System     = require('models/system'),
      HeaderView = require('views/common/header'),
      SystemInfoView;
  
  SystemInfoView = Qorus.View.extend({    
    initialize: function (opts) {
      this.context = {};
      this.views = {};
      this.options = {};
      
      this.opts = opts || {};
      this.user = System.User;
      this.info = System.Info;
      
      _.bindAll(this, 'renderInfo');
      
      this.listenTo(this.info, 'change', this.renderInfo);
      this.renderInfo();
    },
    
    renderInfo: function () {
      if (this.header) this.header.off(false);
      
      this.header = new HeaderView({ info: this.info, user: this.user });
      
      this.title = this.info.get('instance-key') + " | " + this.info.get('omq-version');
      document.title = this.title;
      
      $('#build').text(this.info.get('omq-version') + '.' + this.info.get('omq-build'));
      $('#schema').text(this.info.get('omq-schema'));
    }

  });

  return SystemInfoView;
});
