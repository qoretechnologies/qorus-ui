define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'collections/jobs',
  'text!../../../templates/job/list.html',
  'qorus/dispatcher'
], function($, _, Qorus, Collection, Template, Dispatcher){
  var dispatcher = Dispatcher;
  var ListView = Qorus.ListView.extend({
    initialize: function(){
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
      var _this = this;
      this.listenTo(dispatcher, 'job', function (e) {
        _this.collection.fetch();
      });
    }
  });

  return ListView;
});
