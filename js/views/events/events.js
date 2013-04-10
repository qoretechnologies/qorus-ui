define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!/templates/events/list.html'
], function($, _, Qorus, Template){
  var ListView = Qorus.ListView.extend({
    template: Template,
    initialize: function(collection){
      Qorus.ListView.__super__.initialize.call(this);
      this.collection = collection;
      this.collection.on('update', this.render, this);
      this.render();
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return ListView;
});
