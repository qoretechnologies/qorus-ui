define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/results',
  'text!../../../templates/job/results/list.html',
  'text!../../../templates/job/results/table.html',
  'text!../../../templates/job/results/row.html'
], function ($, _, Qorus, Dispatcher, Collection, Template, TableTpl, RowTpl) {

  var ListView = Qorus.ListView.extend({
    template: Template,
    model_name: 'result',
    subviews: {},
    
    initialize: function (opts) {
      _.bindAll(this);
         
      this.opts = opts;
      _.extend(this.options, opts);
      _.extend(this.context, opts);

      this.collection = new Collection(this.opts);
      this.collection.on('sync', this.updateContext, this);
      this.collection.fetch();
      
      this.createSubviews();
      this.render();
    },

    onRender: function () {
      this.assign('#result-list', this.subviews.table);
    },

    createSubviews: function () {
      this.subviews.table = new Qorus.TableView({
        collection: this.collection, 
        template: TableTpl,
        row_template: RowTpl,
        helpers: this.helpers,
        context: { url: this.url },
        dispatcher: Dispatcher
      })
    },
    
    updateContext: function () {
      // update actual pages
      this.context.page = {
        current_page: this.collection.page,
        has_next: this.collection.hasNextPage()
      };
      // this.subviews.table.render();
      this.subviews.table.render();
    },
  }); 

  return ListView;
});