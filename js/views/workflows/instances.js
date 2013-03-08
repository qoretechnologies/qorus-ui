define([
  'jquery',
  'underscore',
  'qorus/qorus',
  // Pull in the Collection module from above
  'collections/instances',
  'text!/templates/workflow/instances.html'
], function($, _, Qorus, Collection, Template){
  var ListView = Qorus.ListView.extend({
    // el: $("#instances"),
    initialize: function(date, opts){
  	  _.bindAll(this, 'render');
      this.collection = new Collection(date, opts);
  	  this.collection.on('reset', this.render);
  	  this.collection.fetch();
    },
  	render: function(){
      var compiledTemplate = _.template( Template, { items: this.collection.models } );
      this.$el.html(compiledTemplate);
  		return this;
  	},
  });
  return ListView;
});
