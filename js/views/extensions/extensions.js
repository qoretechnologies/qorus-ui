define([
  'jquery',
  'underscore',
  'utils',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/extensions',
  'text!../../../templates/extensions/list.html'
], function($, _, utils, Qorus, Dispatcher, Collection, Template){

  var ListView = Qorus.ListView.extend({
    title: "Extensions",
    model_name: '',
    
    initialize: function () {
      this.template = Template;
      
      this.collection = new Collection();
      this.collection.fetch();
      
      // this.createSubviews();
      this.listenToOnce(this.collection, 'sync', this.render);
    }
  });

  return ListView;
});