define(function (require) {
  var Backbone = require('backbone'),
      $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Settings = require('models/settings'),
      Item     = require('views/system/menu/item'),
      Menu, DefaultMenuItems;

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
    postInit: function () {
      _.each(DefaultMenuItems.models, function (item) {
        this.addMenuItem(item);
      }, this);
      this.setElement($('#nav-main .nav'));
      this.render();
    },
    addMenuItem: function (item) {
      var view;
      
      if (item instanceof Backbone.View) {
        console.log('view');
        view = this.insertView(item, 'self');
      } else {
        view = this.insertView(new Item({ model: item }), 'self');
      }
      
      return view;
    }
  });
  
  return new Menu();
});
