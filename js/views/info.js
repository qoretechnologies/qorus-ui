define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/system',
], function($, _, Backbone, Qorus, System){
  var SystemInfoView = Qorus.View.extend({    
    initialize: function (opts) {
      this.opts = opts || {};
      this.user = System.User;
      this.info = System.Info;
      
      _.bindAll(this, 'renderUser');
      _.bindAll(this, 'renderInfo');
      
      this.listenTo(this.user, 'change', this.renderUser);
      this.listenTo(this.info, 'change', this.renderInfo);
    },
    
    renderUser: function () {
      $('#user-info .username').text(this.user.get(0).name);
    },
    
    renderInfo: function () {
			$('header .version').text(this.info.get('omq-version'));
			$('header .instance-key').text(this.info.get('instance-key'));
			$('title').text(this.info.get('instance-key') + " | " + this.info.get('omq-version'));
      $('#build').text(this.info.get('omq-version') + '.' + this.info.get('omq-build'));
      $('#schema').text(this.info.get('omq-schema'));
    }

  });

  return SystemInfoView;
  
});