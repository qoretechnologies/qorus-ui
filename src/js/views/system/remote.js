define(function (require) {
  var _          = require('underscore'), 
      Dispatcher = require('qorus/dispatcher'),
      Qorus      = require('qorus/qorus'),
      Model      = require('models/health'),
      StatusTpl  = require('tpl!templates/system/health/status.html'),
      DetailTpl  = require('tpl!templates/system/remote/detail.html'),
      View;
      
  require('bootstrap');

  View = Qorus.View.extend({
    template: StatusTpl,
    
    initialize: function () {
      this.context = {};
      this.views = {};
      this.options = {};
      this.model = new Model();
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(Dispatcher, 'system:remote_health_changed', this.render);
      this.render();
    },
    
    render: function (ctx) {
      var data = this.model.toJSON().remote;
      data.health_css = this.getHealthCSS();
      
      _.extend(this.context, { data: data });
      View.__super__.render.call(this, ctx);
      return this;
    },
    
    onRender: function () {
      var data = this.model.toJSON().remote,
          $status;
        
      data.health_css = this.getHealthCSS();
      
      $status = this.$('.status').popover({ 
        content: DetailTpl(data), 
        placement: "right", 
        container: 'body',
        html: true
      });
    },
    
    getHealthCSS: function () {
      var remote = this.model.get('remote'),
          health = remote.health;
      
      if (health === 'RED') return 'danger';
      if (health === 'GREEN') return 'success';
      if (health === 'YELLOW') return 'warning';
      if (health === 'UNKNOWN') return 'info';
      if (health === 'UNREACHABLE') return 'info';
    },
    
    clean: function () {
      this.$('pdata-toggle=tooltip').tooltip('destroy');
    }
  });
  
  return View;
});
