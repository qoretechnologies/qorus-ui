define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/system',
  'text!../../../templates/system/detail.html',
  'views/log',
  'views/system/options'
], function($, _, Backbone, Qorus, System, Template, LogView, OptionsView){
  var SystemInfoView = Qorus.View.extend({
    additionalEvents: {
      'click .nav-tabs a': 'tabToggle'
    },
    
    initialize: function () {
      this.user = System.User;
      this.info = System.Info;
      
      _.bindAll(this, 'renderUser');
      _.bindAll(this, 'renderInfo');
      
      this.user.on('change', this.renderUser);
      this.info.on('change', this.renderInfo);
      this.listenTo(this.info, 'sync', this.render);
      this.template = Template;
      
      this.createSubviews();
      this.info.fetch();
    },
    
    createSubviews: function () {
      this.subviews.log = new LogView({ socket_url: "/system", parent: this });
      this.subviews.audit = new LogView({ socket_url: "/audit", parent: this });
      this.subviews.options = new OptionsView();
    },
    
    onRender: function () {
      this.assign('#options', this.subviews.options);
      this.assign('#log', this.subviews.log);
      this.assign('#audit-log', this.subviews.audit);
    },
     
    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');

      this.active_tab = $target.attr('href');
    },
    
    renderUser: function () {
      $('#user-info .username').text(this.user.get(0).name);
    },
    
    renderInfo: function () {
			$('header .version').text(this.info.get('omq-version'));
			$('header .instance-key').text(this.info.get('instance-key'));
			$('title').text('Qorus - ' + this.info.get('omq-version') + ' - ' + this.info.get('instance-key'));
      $('#build').text(this.info.get('omq-version') + '.' + this.info.get('omq-build'));
      $('#schema').text(this.info.get('omq-schema'));
    },
    
    clean: function () {
      console.log("Cleaning", this, this.subviews, this.subviews.log, this.subviews.log.sss);
      if (this.subviews.log) {
        this.subviews.log.clean();
      }
      this.undelegateEvents();
      this.stopListening();
    }

  });
  return SystemInfoView;
});
