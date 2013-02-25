define([
  'underscore',
  'libs/backbone.rpc',
  // Pull in the Model module from above
  'models/workflow'
], function(_, Backbone, Model){
	// var OCollection = Backbone.Collection.extend({
	// 	url: '/JSON',
	// 	rpc: new Backbone.Rpc({
	// 		 namespaceDelimiter: ''
	// 	}),	
	//   model: Model,
	// methods: {
	// 	read: ['omq.system.service.webapp.getWorkflowOverview'],
	// },
	// myfetch: function (){
	// 	var oview = this;
	// 	this.fetch().done(function(){
	// 		oview.trigger('fetched');
	// 	});
	// }
	// });

  var Collection = Backbone.Collection.extend({
	// initialize: function(){
	// 	var col = this;
	// 	  this.oview = new OCollection();
	// 	  this.oview.on('fetched', function(){
	// 		  col.update(col.oview.models);
	// 		  col;
	// 	  });
	//   },
	initialize: function(){
		this.sort_by = 'name';
		this.sort_order = 'asc';
        this.sort_history = ['',];
		// this.on('all', function(e){ console.log(e)});
	},
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),
    date: null,
    model: Model,
	methods: {
		read: ['omq.system.service.webapp.getWorkflows', 'date'],
	},
	comparator: function(collection){
		return (collection.get(this.sort_by), collection.get(this.sort_history[0]));
	},
	sortByKey: function(key, cb){
        if (key){
            var old_key = this.sort_by;
            this.sort_history.prepend(old_key);
            this.sort_by = key;
            this.sort({ silent: true });
            
            if (old_key == key){
                this.sort_order = (this.sort_order=='asc') ? 'des' : 'asc';
                if(this.sort_order=='des'){
                     this.models = this.models.reverse();   
                }
            } else {
                this.sort_order = 'asc';
            }
            
			this.trigger('reset', this, {});
        }
	},
    search: function(query){
        if(query == "") return this;
 
		var pattern = new RegExp(query,"gi");
		return _(this.filter(function(data) {
		  	return pattern.test(data.get("name"));
		}));
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});