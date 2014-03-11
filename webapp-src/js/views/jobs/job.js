define(function (require) {
  require('jquery.ui');
  
  var $             = require('jquery'),
      _             = require('underscore'),
      Qorus         = require('qorus/qorus'),
      Model         = require('models/job'),
      Log           = require('views/log'),
      Template      = require('text!templates/job/detail.html'),
      ResultsView   = require('views/jobs/results'),
      ResultView    = require('views/jobs/result'),
      BottomBarView = require('views/common/bottom_bar'),
      helpers       = require('qorus/helpers'),
      ModelView;
  
  
  ModelView = Qorus.TabView.extend({
    __name__: 'JobView',
    title: "Job",
    template: Template,
    additionalEvents: {
      'click #results tbody tr': 'loadInfo'
    },
    
    url: function () {
      var url = helpers.getUrl('showJob', { id: this.model.id });
      return url;
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
      this.listenTo(this.model, 'sync', this.render);
      this.model.fetch();
    },
    
    preRender: function (args) {
      var socket_url = '/jobs/' + this.opts.id;
      
      this.addTabView(new ResultsView({
        jobid: this.opts.id, 
        date: this.opts.date,
        statuses: this.opts.filter
      }), { name: 'Results'});
      this.addTabView(new Log({ socket_url: socket_url, parent: this }));
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
            self.renderView('#bottom-content');
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
