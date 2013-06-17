define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/job',
  'views/log',
  'text!../../../templates/job/detail.html',
  'views/jobs/results',
  'jquery.ui'
], function ($, _, Qorus, Dispatcher, Model, Log, Template, ResultsView) {
  var ModelView = Qorus.View.extend({
    title: "Job",
    template: Template,
    additionalEvents: {
      'click .nav-tabs a': 'tabToggle'
    },
    
    initialize: function (opts) {
      if (_.has(opts, 'jobid')) {
        opts.id = opts.jobid;
        delete opts.jobid;
      }
      
      console.log(opts);
      ModelView.__super__.initialize.call(this, opts);
      
      this.model = new Model({ id: opts.id });
      this.model.fetch();
      this.listenTo(this.model, 'sync', this.render);
      this.createSubviews();
    },
    
    createSubviews: function (args) {
      var socket_url = '/jobs/' + this.model.id;
      
      this.subviews.results = new ResultsView({
        jobid: this.model.id
      });
      this.subviews.log = new Log({ socket_url: socket_url, parent: this });
    },
    
    render: function (ctx) {
      var mctx = { item: this.model };
      if (ctx){
        _.extend(mctx, ctx);
      }
      ModelView.__super__.render.call(this, mctx);
      return this;
    },
    
    onRender: function () {
      this.assign('#results', this.subviews.results);
      this.assign('#log', this.subviews.log);
    },
    
    clean: function () {
      if (this.subviews.log) {
        this.subviews.log.clean();
      }
      this.undelegateEvents();
      this.stopListening();
    },

    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');

      this.active_tab = $target.attr('href');
    },
    
  });
  
  return ModelView;
});