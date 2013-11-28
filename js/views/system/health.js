define(function(require) {
  var $          = require('jquery'),
      _          = require('underscore'), 
      Dispatcher = require('qorus/dispatcher'),
      Qorus      = require('qorus/qorus'),
      settings   = require('settings'),
      Model      = require('models/health'),
      StatusTpl  = require('tpl!templates/system/health/status.html'), 
      DetailTpl  = require('tpl!templates/system/health/detail.html'),
      View;

  View = Qorus.View.extend({
    views: {},
    template: StatusTpl,
    
    initialize: function () {
      _.bindAll(this);
      this.model = new Model();
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(Dispatcher, 'status:health_changed', this.update);
      this.model.fetch();
    },
    
    render: function (ctx) {
      var data = this.model.toJSON();
      data.health_css = this.getHealthCSS();
      
      _.extend(this.context, { data: data });
      View.__super__.render.call(this, ctx);
      return this;
    },
    
    onRender: function () {
      var self = this, 
        data = this.model.toJSON(),
        $status;
        
      data.health_css = this.getHealthCSS();
      
      $status = this.$('#status').popover({ 
        content: DetailTpl(data), 
        placement: "right", 
        container: this.$el,
        html: true
      });
    },
    
    getHealthCSS: function () {
      var health = this.model.get('health');
      
      if (health === 'RED') return 'danger';
      if (health === 'GREEN') return 'success';
      if (health === 'YELLOW') return 'warning';
    },
    
    update: function (e) {
      this.model.fetch();
    }
  });
  
  return View;
});
