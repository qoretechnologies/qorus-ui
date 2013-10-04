define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/workflow',
  'views/log',
  'views/common/diagram',
  'text!../../../templates/workflow/meta.html',
  'jquery.ui'
], function ($, _, Qorus, Dispatcher, Model, LogView, DiagramView, Template) {
  
  var ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": "tabToggle",
      "click a.close-detail": "close"
    },
    
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this);
      
      this.template = Template;
      
      if (_.has(opts, 'context')) {
        _.extend(this.context, opts.context);
      }
      
      this.model = new Model({ id: this.opts.model.id });
      this.model.fetch();
      
      this.model.on('change', this.render);
      this.createSubviews();
    },

    render: function (ctx) {
      this.context.item = this.model;
      ModelView.__super__.render.call(this, ctx);
    },
    
    onRender: function () {
      if (this.active_tab) {
        $('a[href='+ this.active_tab + ']').tab('show');
      }
      this.assign('#log', this.subviews.log);
    },
    
    createSubviews: function () {
      var url = '/workflows/' + this.model.id;
      this.subviews.log = new LogView({ socket_url: url, parent: this });
    },
    
    createDiagram: function () {
      if (this.subviews.step_diagram) {
        this.subviews.step_diagram.clean();
      }
      
      var step = this.subviews.step_diagram = new DiagramView({ steps: this.model.mapSteps() });
      this.assign('#steps', step);
    },

    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');
      
      if ($target.hasClass('steps')) {
        this.createDiagram();
      }
      
      if ($target.hasClass('log')) {
        this.subviews.log.fixHeight();
      }

      this.active_tab = $target.attr('href');
    },
    
    clean: function () {
      if (this.subviews.log) {
        this.subviews.log.clean();
      }
      this.undelegateEvents();
      this.stopListening();
    },
    
    close: function (e) {
      if (e) {
        e.preventDefault();  
      }
      
      this.$el.parent()
        .removeClass('show')
        .data('id', null);
      $('.info').removeClass('info');

      this.clean();
    }
    
  });
  
  return ModelView;
});