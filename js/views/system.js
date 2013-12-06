define(function(require){
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    utils = require('utils'),
    Qorus = require('qorus/qorus'),
    System = require('models/system'),
    Template = require('text!templates/system/detail.html'),
    LogView = require('views/log'),
    OptionsView = require('views/system/options'),
    DatasourceView = require('views/system/datasources'),
    PropView = require('views/system/prop'),
    HttpServicesView = require('views/system/http'),
    AlertView = require('views/system/alerts'),
    DashboardView = require('views/system/dashboard'),
    LogsView = require('views/system/logs'),
    SystemInfoView;  


  SystemInfoView = Qorus.View.extend({
    additionalEvents: {
      'click .nav-tabs a': 'tabToggle'
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts || {};
      this.info = System.Info;
      
      this.listenTo(this.info, 'sync', this.render);
      this.template = Template;
      
      if (!this.info.id) this.info.fetch();
    },
    
    preRender: function () {
      this.setView(new DashboardView({ model: this.info }), '#dashboard');
      this.setView(new LogsView(), '#logs');
      this.setView(new OptionsView(), '#options');
      this.setView(new DatasourceView(), '#datasources');
      this.setView(new PropView(), '#prop');
      this.setView(new HttpServicesView(), '#http');
      this.setView(new AlertView(), '#alerts');
    },
    
    onRender: function () {
      if (_.has(this.opts, 'query')) {
        $('a[data-target=#'+ this.opts.query +']').tab('show');
      } 
    },
     
    tabToggle: function(e){
      var $target = $(e.currentTarget),
        active = $('.tab-pane.active'),
        view, target_name;
        
      e.preventDefault();
      
      target_name = $target.data('target') || $target.attr('href');

      view = this.getView(target_name);
      if (view) view.trigger('show');

      $target.tab('show');
      this.active_tab = $target.data('target');
      
      Backbone.history.navigate(utils.getCurrentLocationPath() + $target.attr('href'));
    }

  });
  return SystemInfoView;
});
