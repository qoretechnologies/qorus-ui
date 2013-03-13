define([
  'jquery',
  'underscore',
  'qorus/qorus',
  // Pull in the Collection module from above
  'collections/jobs',
  'text!/templates/job/list.html'
], function($, _, Qorus, Collection, Template){
  var ListView = Qorus.ListView.extend({
    initialize: function(){
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return ListView;
});
