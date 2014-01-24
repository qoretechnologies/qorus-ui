({
    appDir: "../",
    baseUrl: "js",
    dir: "../../webapp-build",
    paths: {
      jquery: 'libs/jquery',
      underscore: 'libs/underscore',
      backbone: 'libs/backbone',
      "backbone.keys": 'libs/backbone.keys',
      "backbone.identity": 'libs/backbone.identity',
      localstorage: 'libs/backbone.localstorage',
      bootstrap: 'libs/bootstrap/js/bootstrap',
      moment: "libs/moment",
      datepicker: "libs/datetime-picker-2/bootstrap-datetimepicker.min",
      "jquery.fixedheader": "libs/fixedheader",
      "jquery.sticky": "libs/jquery.sticky",
      "jquery.rest": "libs/jquery.rest",
      "jquery.ui": "libs/jquery.ui.min",
      "jquery.fixedhead": "libs/jquery.fixedhead",
      "messenger": "libs/messenger/js/messenger.min",
      sprintf: "libs/sprintf-0.7-beta1",
      "bootstrap.multiselect": "libs/bootstrap-multiselect",
      "rainbow": "libs/rainbow/rainbow.min",
      "rainbow.generic": "libs/rainbow/language/generic",
      "rainbow.qore": "libs/rainbow/language/qore",
      "rainbow.html": "libs/rainbow/language/html",
      "rainbow.sql": "libs/rainbow/language/sql",
      "chart": "libs/chart",
      "templates": "../templates",
      "parallel": "libs/parallel",
      "settings": "settings.build",
      
    },
    shim: { 
      "backbone": {
        deps: ["underscore", "jquery", "sprintf", "bootstrap", "jquery.rest"],
        exports: "Backbone"
      },
      "backbone.keys": {
        deps: ['backbone']
      },
      "backbone.identity": {
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
        init: function(m){
          $._messengerDefaults = {
          	extraClasses: 'messenger-fixed messenger-theme-block messenger-on-top'
          }
        }
      },
      "rainbow": {
        exports: "Rainbow"
      },
      "rainbow.generic": {
        deps: ['rainbow']
      },
      "rainbow.qore": {
        deps: ['rainbow']
      },
      "rainbow.html": {
        deps: ['rainbow']
      },
      "rainbow.sql": {
        deps: ['rainbow']
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
