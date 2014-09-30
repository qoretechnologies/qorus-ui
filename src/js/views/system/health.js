define(function (require) {
  var _           = require('underscore'),
      Dispatcher  = require('qorus/dispatcher'),
      Qorus       = require('qorus/qorus'),
      Model       = require('models/health'),
      DetailTpl   = require('tpl!templates/system/health/detail.html'),
      TaskBarIcon = require('views/common/taskbaricon'),
      View, DetailView;
      
  function getHealthCSS (health, noprefix) {
    var prefix = (noprefix===true) ? '' : 'text-';
    
    if (health === 'RED' && !noprefix) return prefix + 'error';
    if (health === 'RED' && noprefix === true) return prefix + 'danger';
    if (health === 'GREEN') return prefix + 'success';
    if (health === 'YELLOW') return prefix + 'warning';
    if (health === 'UNKNOWN') return prefix + 'info';
    if (health === 'UNREACHABLE') return prefix + 'info';
  }
  
  DetailView = Qorus.ModelView.extend({
    __name__: 'DetailView',
    template: DetailTpl,
    preRender: function () {
      this.context.health_css = this.getHealthCSS();
    },
    getHealthCSS: function () {
      var health = this.model.get('health');
      
      return getHealthCSS(health, true);
    }
  });

  View = TaskBarIcon.extend({
    icon: 'icon-stethoscope', 
    icon_class: function () {
      return this.getHealthCSS();
    },
    icon_type: 'fa-icon-sign',
    
    postInit: function () {
      _.bindAll(this, 'icon_class');
      this.model = new Model();
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(Dispatcher, 'system:health_changed', this.update);
      this.update();
      this.initDetailView(new DetailView({ model: this.model }));
    },
    
    getHealthCSS: function () {
      var health = this.model.get('health');
      
      return getHealthCSS(health);
    },
    
    update: function () {
      this.model.fetch();
    },
    
    close: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });
  
  return View;
});
