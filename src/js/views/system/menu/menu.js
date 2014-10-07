define(function (require) {
  var Backbone = require('backbone'),
      $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Settings = require('models/settings'),
      Item     = require('views/system/menu/item'),
      Menu, DefaultMenuItems, CollapseItem, CollapseOffItem;
      
      
  CollapseItem = Item.extend({
    className: 'extra menu-collapse'
  });
  
  CollapseOffItem = Item.extend({
    className: 'extra menu-collapse-off'
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
  
  
  Menu = Qorus.View.extend({
    tagName: 'ul',
    className: 'nav nav-list',
    
    offset: function () {
      return Settings.get('menu-offset') || false;
    },
    
    additionalEvents: {
      'click .menu-collapse': 'setOffsetOn',
      'click .menu-collapse-off': 'setOffsetOff'
    },
    
    postInit: function () {
      _.each(DefaultMenuItems.models, function (item) {
        this.addMenuItem(item);
      }, this);
      this.setElement($('#nav-main .nav'));
      this.render();
    },
    
    onRender: function () {
      this.addOffsetIcon();
    },
    
    addMenuItem: function (item, append) {
      var view;
      
      if (item instanceof Backbone.View) {
        view = this.insertView(item, 'self');
      } else {
        if (item.has('view')) {
          itemView = item.get('view');
          item.set('view', null);
        } else {
          itemView = Item;
        }

        view = this.insertView(new itemView({ model: item }), 'self', append);
      }
      
      return view;
    },
    
    setOffset: function () {
      if (_.result(this, 'offset') === false) {
        $('body').addClass('navigation-pinned');
        Settings.set('menu-offset', true);
      } else {
        $('body').removeClass('navigation-pinned');
        Settings.set('menu-offset', false);
      }
      this.addOffsetIcon();
    },
    
    addOffsetIcon: function () {
      var view = _.find(this.views['self'], function (item) { return item instanceof CollapseItem || item instanceof CollapseOffItem });
      
      if (view) {
        view.close();
        this.views['self'].pop();
      }
      
      if (_.result(this, 'offset')) {
        this.addMenuItem(new CollapseOffItem({
          model: new Backbone.Model({
            name: 'Keep memu',
            url: "#",
            icon: 'chevron-sign-right'
          })
        }), true);
      } else {
        this.addMenuItem(new CollapseItem({
          model: new Backbone.Model({
            name: 'Don\'t keep menu',
            url: "#",
            icon: 'chevron-sign-left'
          })
        }), true);
      }
    }
  });
  
  return new Menu();
});