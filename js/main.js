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
    datepicker: "libs/datetime-picker/bootstrap-datetimepicker",
    "jquery.fixedheader": "libs/fixedheader",
    "jquery.sticky": "libs/jquery.sticky"
  },
  shim: { 
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone" //attaches "Backbone" to the window object
    },
    "underscore": {
      exports: "_"
    },
    "bootstrap": {
      deps: ['jquery']
    },
    "backbone.rpc": ['backbone'],
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
    }
  },
  templates: '../templates'
});

require([
// Load our app module and pass it to our definition function
'app', ], function(App) {
  // The "app" dependency is passed in as "App"
  App.initialize();
  return App;
});
