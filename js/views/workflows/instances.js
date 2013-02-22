define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'collections/instances',
  'text!/templates/workflow/instances.html'
], function($, _, Backbone, Collection, Template){
  var ListView = Backbone.View.extend({
    // el: $("#instances"),
    initialize: function(){
	  _.bindAll(this, 'render');
      this.collection = new Collection();
	  this.collection.on('reset', this.render);
	  this.collection.fetch();
    },
	render: function(){
        var compiledTemplate = _.template( Template, { items: this.collection.models } );
        this.$el.html(compiledTemplate);
		return this;
	},
  });
  // Returning instantiated views can be quite useful for having "state"
  return ListView;
});
