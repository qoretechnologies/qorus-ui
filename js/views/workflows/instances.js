define([
  'jquery',
  'underscore',
  'qorus/qorus',
  // Pull in the Collection module from above
  'collections/instances',
  'text!/templates/workflow/instances.html'
], function($, _, Qorus, Collection, Template){
  var ListView = Qorus.ListView.extend({
    additionalEvents: {
		  'click button[data-action]': 'runAction',
    },
    initialize: function(opts){
  	  _.bindAll(this, 'render');
      this.collection = new Collection(opts);
  	  this.collection.on('reset', this.render);
  	  this.collection.fetch();
    },
  	render: function(){
      var compiledTemplate = _.template( Template, { items: this.collection.models } );
      this.$el.html(compiledTemplate);
  		return this;
  	},
  	runAction: function(e){
  		e.preventDefault();
      var data = e.currentTarget.dataset;
      if (data.id && data.action){
    		var inst = this.collection.get(data.id);
    		inst.doAction(data.action); 
      }
  	},
  });
  return ListView;
});
