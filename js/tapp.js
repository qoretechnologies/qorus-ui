var qorus_json_url = "/JSON";

// default classes

var QorusModel = Backbone.Model.extend({
	url: qorus_json_url,
	rpc: new Backbone.Rpc({
		 namespaceDelimiter: ''
	}),
	methods: {
		read: ['omq.system.get-status']
	},
});


var QorusCollection = Backbone.Collection.extend({
	url: qorus_json_url,
	rpc: new Backbone.Rpc({
		 namespaceDelimiter: ''
	}),	
});

var qorus = new QorusModel();

qorus.fetch({ 
	success: function (){
		$('.version').text(qorus.get('omq-version'));
		$('.instance-key').text(qorus.get('instance-key'));
	}
});


// workflow

var Workflow = QorusModel.extend({
	url: qorus_json_url,
	rpc: new Backbone.Rpc({
		 namespaceDelimiter: ''
	}),
	methods: {
		read: ['omq.system.service.info.getWFIAllInfo']
	}
});

var Workflows = QorusCollection.extend({
	model: Workflow,
	methods: {
		read: ['omq.system.service.webapp.getWorkflowOverview']
	}
})


var WorkflowsView = Backbone.View.extend({
	el: $('content'),
	initialize: function () {
		this.render();
	},
	render: function ( collection ) {
		var tpl = _.template($('#workflow-list').html());
		console.log(tpl());
		this.$el.html(tpl);
	}
})


var Service = QorusModel.extend({
	url: qorus_json_url,
	rpc: new Backbone.Rpc({
		namespaceDelimiter: ''
	}),
	methods: {
		read: ['omq.system.services.']
	}
});


var Services = QorusCollection.extend({
	model: Service,
	url: qorus_json_url,
	rpc: new Backbone.Rpc({
		namespaceDelimiter: ''
	}),
	methods: {
		read: ['omq.system.service.info.getServiceMetadata']
	}	
});


var Job = QorusModel.extend({
	methods: {
		read: ['omq.system.service.info.getJob']
	}
});

var Jobs = QorusCollection.extend({
	model: Job,
	url: qorus_json_url,
	rpc: new Backbone.Rpc({
		namespaceDelimiter: ''	
	}),
	methods: {
		read: ['omq.system.service.getJobMetadata']		
	}
});