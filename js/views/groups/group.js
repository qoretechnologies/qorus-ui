define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/group',
  'text!../../../templates/job/detail.html'
], function ($, _, Qorus, Dispatcher, Model, Log, Template) {
  var ModelView = Qorus.View.extend({
    title: "Group",
    template: Template,
    
    initialize: function (opts) {
      if (_.has(opts, 'jobid')) {
        opts.id = opts.jobid;
        delete opts.jobid;
      }
      this.opts = opts || {};
      this.date = this.opts.date;
      
      ModelView.__super__.initialize.call(this, opts);
      
      this.model = new Model({ id: opts.id });
      this.model.fetch();
      this.listenTo(this.model, 'sync', this.render);
    },
    
    preRender: function () {
      
    }
  });
  
  return ModelView;
});