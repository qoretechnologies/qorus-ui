require.config({
  baseUrl: '/js',
  paths: {
    jquery: 'libs/jquery',
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
    bootstrap: 'libs/bootstrap/js/bootstrap.min',
    moment: "libs/moment",
    later: "libs/later/later.min",
    "later.recur": "libs/later/later-recur.min",
    "later.cron": "libs/later/later-cron.min",
    datepicker: "libs/datetime-picker-2/bootstrap-datetimepicker.min",
    "jquery.fixedheader": "libs/fixedheader",
    "jquery.sticky": "libs/jquery.sticky",
    "jquery.rest": "libs/jquery.rest",
    "jquery.ui": "libs/jquery.ui.min",
    "jquery.pageslide": "libs/jquery.pageslide.min",
    "messenger": "libs/messenger/js/messenger",
    sprintf: "libs/sprintf-0.7-beta1",
    "bootstrap.multiselect": "libs/bootstrap-multiselect",
    "rainbow": "libs/rainbow/rainbow.min",
    "rainbow.generic": "libs/rainbow/language/generic",
    "rainbow.qore": "libs/rainbow/language/qore",
    "rainbow.html": "libs/rainbow/language/html",
    "rainbow.sql": "libs/rainbow/language/sql",
    "chart": "libs/chart"
  },
  shim: { 
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
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
    "later": ['underscore'],
    "later.cron": {
      deps: ['later', 'later.recur'],
      exports: 'cron'
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
    "messenger": {
      deps: ['jquery', 'backbone'],
      exports: 'Messenger',
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
  templates: '../templates',
  config: {
    'REST_API_PREFIX': '/test'
  }
});

require([
// Load our app module and pass it to our definition function
'app', ], function(App) {
  // The "app" dependency is passed in as "App"
  App.initialize();
  return App;
});
