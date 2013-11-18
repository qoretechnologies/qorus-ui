define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'settings',
  'models/system',
  'text!../../../templates/system/health/status.html',
  'tpl!../../../templates/system/health/detail.html'
], function($, _, Backbone, Qorus, settings, Model, StatusTpl, DetailTpl){
  var status_url = settings.REST_API_PREFIX + '/system/health';

  var View = Qorus.View.extend({
    views: {},
    model: Model.Info,
    template: StatusTpl,
    
    initialize: function () {
      var self = this;
      
      $.get(status_url).done(function (data) {
        self.data = data;
        self.trigger('fetch');
      });
      
      this.on('fetch', this.render);
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
        placement: "left", 
        container: this.$el,
        html: true
      });
      
      // $status.on('show', function () {
      //   self.$('.popover').css('top', '100px');
      //   console.log(self.$('.popover'));
      // });
    },
    
    getHealthCSS: function () {
      var health = this.model.get('health');
      
      if (health === 'RED') return 'danger';
      if (health === 'GREEN') return 'success';
      if (health === 'YELLOW') return 'warning';
    }
  });
  
  return View;
});