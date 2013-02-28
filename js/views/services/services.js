define([
  'jquery',
  'underscore',
  'qorus/qorus',
  // Pull in the Collection module from above
  'collections/services',
  'text!/templates/service/list.html'
], function($, _, Qorus, Collection, Template){
  var ListView = Qorus.ListView.extend({
    el: $("#content"),
    initialize: function(){
        this.template = Template;
        ListView.__super__.initialize.call(this, Collection);
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return ListView;
});
