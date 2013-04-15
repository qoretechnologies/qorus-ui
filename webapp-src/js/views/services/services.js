define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'collections/services',
  'text!../../../templates/service/list.html',
  'sprintf'
], function($, _, Qorus, Collection, Template){
  var ListView = Qorus.ListView.extend({
    initialize: function(){
        this.template = Template;
        ListView.__super__.initialize.call(this, Collection);
    },
    additionalEvents: {
      'click button[data-option]': 'setOption',
    },
    setOption: function(e){
      var data = $(e.currentTarget).data();
      var svc = this.collection.get(data.id);
      var opts = {};
      opts[data.option] = data.value;
      $.put(svc.url(), opts, null, 'application/json')
      .done(
        function(res){
          console.log(res);
        }
      );
      this.collection.fetch();
    }
  });
  return ListView;
});
