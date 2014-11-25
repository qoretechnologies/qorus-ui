require.config({
  baseUrl: '/js',
  paths: {
    jquery: 'libs/jquery',
    lodash: 'libs/lodash.underscore',
    // 'underscore.string': 'libs/underscore.string',
    underscore: 'libs/lodash',
    backbone: 'libs/backbone',
    'backbone.keys': 'libs/backbone.keys',
    'backbone.filtered.collection': 'libs/backbone.filtered.collection',
    localstorage: 'libs/backbone.localstorage',
    dualstorage: 'libs/backbone.dualstorage',
    bootstrap: 'libs/bootstrap/js/bootstrap',
    "backbone.identity": "libs/backbone.identity",
    moment: "libs/moment",
    "jquery.fixedheader": "libs/fixedheader",
    "jquery.sticky": "libs/jquery.sticky",
    "jquery.rest": "libs/jquery.rest",
    "jquery.ui": "libs/jquery.ui.min",
    "jquery.pageslide": "libs/jquery.pageslide.min",
    "jquery.fixedhead": "libs/jquery.fixedhead",
    "jquery.expanding": "libs/jquery.expanding",
    // "jquery.floatthead": "libs/jquery.floatThead",
    "messenger": "libs/messenger/js/messenger",
    sprintf: "libs/sprintf-0.7-beta1",
    "bootstrap.multiselect": "libs/bootstrap-multiselect",
    "chart": "libs/chart",
    "templates": "../templates",
    "parallel": "libs/parallel",
    "settings": "settings.dev",
    "prism": "libs/prism/prism",
    "piwik.tracker": "libs/piwik/tracker",
    "piwik": "libs/piwik/piwik"
  },
  shim: { 
    "backbone": {
      deps: ["underscore", "sprintf", "jquery", "jquery.rest", "jquery.ui", "bootstrap"],
      exports: "Backbone"
    },
    "backbone.keys": {
      deps: ['backbone']
    },
    "backbone.identity": {
      deps: ['backbone']
    },
    "backbone.filtered.collection": {
      deps: ['backbone']
    },
    localstorage: {
      deps: ['backbone']
    },
    dualstorage: {
      deps: ['backbone']
    },
    "underscore": {
      exports: "_"
    },
    "bootstrap": {
      deps: ['jquery']
    },
    "bootstrap.mulitselect": {
      deps: ['bootstrap'],
      exports: 'jQuery.fn.multiselect'
    },
    // "later": ['underscore'],
    // "later.cron": {
    //   deps: ['later', 'later.recur'],
    //   exports: 'cron'
    // },
    "jquery.fixedhead": {
      deps: ["jquery"],
      exports: 'jQuery.fn.fixedhead'
    },
    "jquery.fixedheader": {
      deps: ['jquery'],
      exports: 'jQuery.fn.fixedHeader'
    },
    "jquery.sticky": {
      deps: ['jquery'],
      exports: 'jQuery.fn.sticky'
    },
    "jquery.rest": {
      deps: ['jquery']
    },
    "jquery.ui": {
      deps: ['jquery']
    },
    "jquery.pageslide": {
      deps: ['jquery']
    },
    // "jquery.floatthead": {
    //   deps: ['jquery']
    // },
    "messenger": {
      deps: ['jquery', 'backbone'],
      exports: 'Messenger',
      init: function () {
        this.Messenger.options = {
          extraClasses: 'messenger-fixed messenger-theme-block messenger-on-top messenger-on-right'
        };
      }
    },
    "prism": {
      exports: "Prism"
    }
  },
  templates: '../templates',
//  urlArgs: 'theseus=no',
  waitSeconds: 300
});

require([
// Load our app module and pass it to our definition function
'app'], function(App) {
  // The "app" dependency is passed in as "App"
  App.initialize();
  return App;
});
