define(function (require) {
  var _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Model       = require('models/health'),
      Dispatcher  = require('qorus/dispatcher'),
      TaskBarIcon = require('views/common/taskbaricon'),
      DetailTpl   = require('tpl!templates/system/health/remote.html'),
      View, DetailView, LEVELS;

  LEVELS = {
    'GREEN': 0,
    'YELLOW': 1,
    'UNKWNOWN': 2,
    'UNREACHABLE': 2,
    'RED': 3
  };

  function getHealthCSS (health, noprefix) {
    var prefix = (noprefix===true) ? '' : 'text-';

    if (health === 'RED' && !noprefix) return prefix + 'error';
    if (health === 'RED' && noprefix === true) return prefix + 'danger';
    if (health === 'GREEN') return prefix + 'success';
    if (health === 'YELLOW') return prefix + 'warning';
    if (health === 'UNKNOWN') return prefix + 'warning';
    if (health === 'UNREACHABLE') return prefix + 'warning';
  }

  DetailView = Qorus.ModelView.extend({
    __name__: 'DetailView',
    template: DetailTpl,
    preRender: function () {
      this.context.getHealthCSS = getHealthCSS;
    }
  });

  View = TaskBarIcon.extend({
    icon: 'icon-sitemap', 
    icon_class: function () {
      var health = this.getHealthCSS();
      return health;
    },
    icon_type: 'fa-icon-sign',
    
    postInit: function () {
      _.bindAll(this, 'icon_class');
      this.model = new Model();
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(Dispatcher, 'system:remote_health_changed', this.update);
      this.update();
      this.initDetailView(new DetailView({ model: this.model }));
    },
    
    getHealthCSS: function () {
      var remote = this.model.get('remote'),
          level  = 1,
          health = 'GREEN';
      
      _.each(remote, function (rem) {
        if (LEVELS[rem.health] > level) {
          level = LEVELS[rem.health];
          health = rem.health;
        }
      });
      
      return getHealthCSS(health);
    },
    
    update: function () {
      this.model.fetch();
    },
    
    off: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });

  return View;
});
