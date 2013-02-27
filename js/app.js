// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'router', // Request router.js
  'bootstrap',
  'models/system'
], function($, _, Backbone, Router, _bootstrap, System){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
	var system = new System.Info();
    var user = new System.User();
	
    // TODO: create custom views
	system.fetch({ 
		success: function (){
			$('header .version').text(system.get('omq-version'));
			$('header .instance-key').text(system.get('instance-key'));
			$('title').text('Qorus - ' + system.get('omq-version') + ' - ' + system.get('instance-key'));
		}
	});
    
    user.fetch().done(function (){
       $('#user-info .username').text(user.get('name'));
    });
	
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});