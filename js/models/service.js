define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'sprintf'
], function($, _, Qorus){
  var ServiceModel = Qorus.Model.extend({
    defaults: {
      threads: '-',
    },
    urlRoot: '/rest/services/',
    idAttribute: "serviceid",

	// get available actions
	actions: function () {
		var status = this.get('status');
		var actions = []
		if (status == 'unloaded') {
			actions.push('load');
		} else {
			actions.push('unload');
		}
		actions.push('reset');

		return actions;
	}
  });
  return ServiceModel;
});