// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  baseUrl: '/js',
  paths: {
    jquery: 'libs/jquery',
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
	bootstrap: 'libs/bootstrap/js/bootstrap.min'
  },
  shim: {
      /* Set bootstrap dependencies (just jQuery) */
	  "backbone": {
		deps: ["underscore", "jquery"],
		exports: "Backbone"  //attaches "Backbone" to the window object
	  },
      "underscore": {
        exports: "_"
      },
     "bootstrap": {
		 deps: ['jquery']
     },
	 "backbone.rpc": ['backbone']
  },
  templates: '../templates'
});

require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
  return App;
});
