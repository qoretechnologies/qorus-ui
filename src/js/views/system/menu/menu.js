define(function (require) {
  var Backbone = require('backbone'),
      $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Settings = require('models/settings'),
      Item     = require('views/system/menu/item'),
      
      Menu, MainMenu, ControlsMenu, DefaultMenuItems, CollapseItem, CollapseOffItem;
      
      
  function isCollapseItem(item) {
    return item instanceof CollapseOffItem || item instanceof CollapseItem;
  }
      
  CollapseItem = Item.extend({
    className: 'extra menu-collapse',
    postInit: function () {
      $('body').addClass('navigation-pinned');
    }
  });
  
  CollapseOffItem = Item.extend({
    className: 'extra menu-collapse-off',
    postInit: function () {
      $('body').removeClass('navigation-pinned');
    }
  });

  DefaultMenuItems = new Qorus.Collection([
    { 
      name: 'System',
      url: '/system',
      icon: 'cog'
    },
    { 
      name: 'Workflows',
      url: '/workflows',
      icon: 'sitemap'
    },
    { 
      name: 'Services',
      url: '/services',
      icon: 'th-list'
    },
    { 
      name: 'Jobs',
      url: '/jobs',
      icon: 'calendar'
    },
    { 
      name: 'Search',
      url: '/search',
      icon: 'search'
    },
    { 
      name: 'Groups',
      url: '/groups',
      icon: 'tags'
    },
    { 
      name: 'Ocmd',
      url: '/ocmd',
      icon: 'terminal'
    },
    { 
      name: 'Library',
      url: '/library',
      icon: 'book'
    },
    { 
      name: 'Extensions',
      url: '/extensions',
      icon: 'beer'
    }
  ]);
  
  MainMenu = Qorus.View.extend({
    tagName: 'ul',
    className: 'nav nav-list',
    
    addDefaultItems: function () {
      _.each(DefaultMenuItems.models, function (item) {
        this.addMenuItem(item, true);
      }, this);
    },
    
    addMenuItem: function (item, append) {
      var view, itemView;
      
      if (item instanceof Backbone.View) {
        view = this.insertView(item, 'self');
      } else {
        if (_.result(item, 'view')) {
          itemView = item.get('view');
          item.set('view', null);
        } else {
          itemView = Item;
        }

        view = this.insertView(new itemView({ model: item }), 'self', append);
      }
            
      return view;
    }
  });
  
  ControlsMenu = Qorus.View.extend({
    tagName: 'ul',
    className: 'extra',
    
    offset: function () {
      return Settings.get('menu-offset') || false;
    },
    
    addDefaultItems: function () {
      this.setOffsetIcon();
    },
    
    setOffsetIcon: function () {
      var view = _.find(this.getView('self'), isCollapseItem);
      
      if (view) {
        _.remove(this.views.self, isCollapseItem);
        view.close();
      }

      if (_.result(this, 'offset')) {
        this.insertView(new CollapseOffItem({
          model: new Backbone.Model({
            name: 'Keep memu',
            url: "#",
            icon: 'chevron-sign-right'
          })
        }), 'self', true);
      } else {
        this.insertView(new CollapseItem({
          model: new Backbone.Model({
            name: 'Don\'t keep menu',
            url: "#",
            icon: 'chevron-sign-left'
          })
        }), 'self', true);
        $('html').trigger('click.navigation');
      }
    }
  });
  
  Menu = Qorus.View.extend({
    tagName: 'nav',
    template: _.template('<ul class="main nav nav-list" /><ul class="extra nav nav-list" />'),
    
    postInit: function () {
      this.setElement($('#nav-main'));
      this.setView(new MainMenu(), '.main')
        .addDefaultItems();
      this.setView(new ControlsMenu(), '.extra')
        .addDefaultItems();
      
      this.render();
    },
    
    offset: function () {
      return Settings.get('menu-offset') || false;
    },
    
    additionalEvents: {
      'click .menu-collapse': 'setOffset',
      'click .menu-collapse-off': 'setOffset'
    },
    
    setOffset: function (e) {
      if (e) { e.preventDefault(); }
      
      if (_.result(this, 'offset') === false) {
        Settings.save({ 'menu-offset': true });
      } else {
        Settings.save({ 'menu-offset': false });
      }
      this.getView('.extra').setOffsetIcon();
    },
    
    addMenuItem: function (item, menu) {
      menu = menu || 'main';
      var view = this.getView('.' + menu);
      
      view.addMenuItem(item);
      
      return this;
    }
  });
  
  return new Menu();
});