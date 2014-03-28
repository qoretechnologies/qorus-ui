({
    appDir: "../",
    baseUrl: "js",
    dir: "../../dist",
    paths: {
      jquery: 'libs/jquery',
      underscore: 'libs/underscore',
      bootstrap: 'libs/bootstrap/js/bootstrap',
      "jquery.rest": "libs/jquery.rest",
      "jquery.ui": "libs/jquery.ui.min",
      sprintf: "libs/sprintf-0.7-beta1",
      backbone: 'libs/backbone',
      "backbone.keys": 'libs/backbone.keys',
      "backbone.identity": 'libs/backbone.identity',
      'backbone.filtered.collection': 'libs/backbone.filtered.collection',
      localstorage: 'libs/backbone.localstorage',
      moment: "libs/moment",
      "jquery.fixedheader": "libs/fixedheader",
      "jquery.sticky": "libs/jquery.sticky",
      "jquery.fixedhead": "libs/jquery.fixedhead",
      "messenger": "libs/messenger/js/messenger.min",
      "bootstrap.multiselect": "libs/bootstrap-multiselect",
      "chart": "libs/chart",
      "templates": "../templates",
      "parallel": "libs/parallel",
      "settings": "settings.build",
      "prism": "libs/prism/prism"
    },
    wrapShim: true,
    shim: { 
      "backbone": {
        deps: ["underscore", "jquery", "sprintf", "jquery.rest", "jquery.ui", "bootstrap"],
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
      localestorage: {
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
      "jquery.fixedhead": {
        deps: ["jquery"],
        exports: 'jQuery.fn.fixedhead'
      },
      "messenger": {
        deps: ['jquery', 'backbone'],
        exports: 'jQuery.fn.messenger',
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
    removeCombined: true,
    templates: '../templates',
    modules: [
      { name: 'main' }
    ],
    logLevel: 3,
    // onBuildRead: function (moduleName, path, contents) {
    //     return contents.replace(/debug.log(.*);/g, '');
    // }
    // optimize: "none"
})
