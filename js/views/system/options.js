define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/system',
  'collections/options',
  'text!../../../templates/system/options.html'
], function($, _, Backbone, Qorus, System, Collection, Template){
  var ListView = Qorus.ListView.extend({
    additionalEvents: {
      "click td[data-editable]": "editOption"
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts || {};
      ListView.__super__.initialize.call(this, opts);
      
      this.collection = new Collection(this.opts);
      this.template = Template;
 
      this.collection.fetch();
      this.listenToOnce(this.collection, 'sync', this.render);
    },
    
    editOption: function (e) {
      var $target = $(e.currentTarget);
      console.log($target.data());
    }
  });
  
  return ListView;
});