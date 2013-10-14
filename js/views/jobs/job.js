define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/job',
  'views/log',
  'text!../../../templates/job/detail.html',
  'views/jobs/results',
  'views/jobs/result',
  'views/common/bottom_bar',
  'jquery.ui'
], function ($, _, Qorus, Dispatcher, Model, Log, Template, ResultsView, ResultView, BottomBarView) {
  var ModelView = Qorus.View.extend({
    title: "Job",
    template: Template,
    additionalEvents: {
      'click .nav-tabs a': 'tabToggle',
      'click #results tbody tr': 'loadInfo',
    },
    
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
    
    preRender: function (args) {
      var socket_url = '/jobs/' + this.opts.id;
      
      this.setView(new ResultsView({
        jobid: this.opts.id, 
        date: this.opts.date
      }), '#results');
      this.setView(new Log({ socket_url: socket_url, parent: this }), '#log');
      this.setView(new BottomBarView({}), '#bottom-bar');
    },
    
    render: function (ctx) {
      var mctx = { item: this.model };
      if (ctx){
        _.extend(mctx, ctx);
      }
      ModelView.__super__.render.call(this, mctx);
      return this;
    },

    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');

      this.active_tab = $target.attr('href');
    },
    
    // opens the bottom bar with detail info about the Instance/Order
    loadInfo: function (e) {
      var el = $(e.currentTarget);
      // var dataview = this.currentDataView();
      var bar = this.getView('#bottom-bar');
      var self = this;
      
      if (e.target.localName == 'tr' || e.target.localName == 'td') {
        e.stopPropagation();
        e.preventDefault();

        if (el.hasClass('info')) {
          bar.hide();
          el.removeClass('info');
        } else {
          var oview = this.setView(new ResultView({ id: el.data('id') }), '#bottom-content', true);
      
          oview.listenTo(oview.model, 'change', function () {
            bar.render();
            bar.show();

            // highlite/unhighlite selected row
            $('tr', el.parent()).removeClass('info');
            $('tr[data-id='+ el.data('id') +']').addClass('info');
          });        
        }
      }
    }
    
  });
  
  return ModelView;
});