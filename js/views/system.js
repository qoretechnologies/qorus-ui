define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/system',
], function($, _, Backbone, Qorus, System){
  var SystemInfoView = Backbone.View.extend({
    initialize: function(){
      this.user = new System.User();
      this.info = new System.Info();
      
      _.bindAll(this, 'renderUser');
      _.bindAll(this, 'renderInfo');
      
      this.user.on('change', this.renderUser);
      this.info.on('change', this.renderInfo);
      
      this.user.fetch();
      this.info.fetch();
    },
    renderUser: function(){
      $('#user-info .username').text(this.user.get('name'));
    },
    renderInfo: function(){
			$('header .version').text(this.info.get('omq-version'));
			$('header .instance-key').text(this.info.get('instance-key'));
			$('title').text('Qorus - ' + this.info.get('omq-version') + ' - ' + this.info.get('instance-key'));
      $('#build').text(this.info.get('omq-version') + '.' + this.info.get('omq-build'));
    }
  });
  return SystemInfoView;
});
