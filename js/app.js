// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'router', // Request router.js
  'bootstrap',
  'models/system'
], function($, _, Backbone, Router, _bootstrap, Qorus){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
	var qorus = new Qorus();
	
	qorus.fetch({ 
		success: function (){
			$('.version').text(qorus.get('omq-version'));
			$('.instance-key').text(qorus.get('instance-key'));
		}
	});
	
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});