define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'collections/orders',
  'text!/templates/workflow/orders.html',
  'views/workflows/toolbar'
], function($, _, Qorus, Collection, Template, Toolbar){
  var ListView = Qorus.ListView.extend({
    template: Template,
    context: {
      action_css: {
        'block': 'btn-inverse',
        'cancel': 'btn-danger',
        'retry': 'btn-success'
      }
    },
    subviews: {},
    additionalEvents: {
		  'click button[data-action]': 'runAction',
    },
    initialize: function(opts){
  	  _.bindAll(this, 'render');
      _.extend(this.context, opts);
      
      this.subviews['toolbar'] = new Toolbar(opts);
      this.collection = new Collection(opts);
  	  this.collection.on('reset', this.render);
  	  this.collection.fetch();
    },
  	runAction: function(e){
  		e.preventDefault();
      var data = e.currentTarget.dataset;
      if (data.id && data.action){
    		var inst = this.collection.get(data.id);
    		inst.doAction(data.action); 
      }
  	},
    render: function(){
      ListView.__super__.render.call(this);
      this.assign('.toolbar', this.subviews['toolbar']);
      return this;
    }
  });
  return ListView;
});
