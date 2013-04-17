define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'text!../../../templates/workflow/order_data.html'
], function($, _, Qorus, Template){
  var ListView = Qorus.ListView.extend({
    template: Template,
    additionalEvents: {
      // 'click button[data-action]': 'runAction',
    },
    initialize: function(opts){
  	  _.bindAll(this, 'render');
      this.collection = new Collection(opts);
  	  this.collection.on('reset', this.render);
  	  this.collection.fetch();
    }
    // runAction: function(e){
    //   e.preventDefault();
    //       var data = e.currentTarget.dataset;
    //       if (data.id && data.action){
    //         var inst = this.collection.get(data.id);
    //         inst.doAction(data.action); 
    //       }
    // },
  });
  return ListView;
});
