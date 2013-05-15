define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!../../../templates/events/list.html',
  'qorus/events'
], function($, _, Qorus, Template, Events){
  var ListView = Qorus.ListView.extend({
    template: Template,
    
    title: "Events",
    
    initialize: function () {
      Qorus.ListView.__super__.initialize.call(this);

      this.collection = Events;
      this.listenTo(this.collection, 'update', this.render);
      this.render();
    }
  });

  return ListView;
});
