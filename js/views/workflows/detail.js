define(function (require) {
  var $             = require('jquery'), 
      _             = require('underscore'),
      utils         = require('utils'),
      Qorus         = require('qorus/qorus'),
      LogView       = require('views/log'),
      DiagramView   = require('views/common/diagram'),
      Template      = require('tpl!templates/workflow/meta.html'),
      DetailTpl     = require('tpl!templates/workflow/info.html'),
      EditTemplate  = require('tpl!templates/common/option_edit.html'),
      AutostartView = require('views/workflows/autostart'),
      HeaderTpl     = require("tpl!templates/workflow/detail_header.html"),
      LibraryView   = require('views/common/library'),
      AlertsTpl     = require('tpl!templates/common/alerts.html'),
      ModelView, HeaderView, AlertsView, PaneView;      


  AlertsView = Qorus.ModelView.extend({
    __name__: 'JobAlertsPaneView',
    name: 'Alerts',
    template: AlertsTpl
  });

  HeaderView = Qorus.View.extend({
    __name__: 'WorkflowHeaderView',
    template: HeaderTpl,

    initialize: function (options) {
      this.views = {},
      this.model = options.model;
    },
    
    preRender: function () {
      var as_view = new AutostartView({ model: this.model });
      this.context.item = this.model.toJSON();
      this.context._item = this.model;
      this.context.pull_right = false;
      this.context.show_groups = false;
      this.setView(as_view, '.autostart');
    }
  });
  
  PaneView = Qorus.ModelView.extend({
    template: DetailTpl,
    name: 'Detail'
  });
  
  ModelView = Qorus.TabView.extend({
    __name__: "WorkflowDetailView",
    views: {},
    url: function () {
      return "/" + this.model.id;
    },
    
    additionalEvents: {
      "click a.close-detail": "close",
      "click td[data-editable]": "editOption",
      "click [data-action]": 'runAction'
    },
    
    initialize: function (opts) {
      ModelView.__super__.initialize.apply(this, arguments);
      this.views = {};
      
      this.template = Template;
      
      if (_.has(opts, 'context')) {
        _.extend(this.context, opts.context);
      }
      
      // console.log(model);
      this.model = opts.model;
      this.listenTo(this.model, 'change:has_alerts', this.render);
    },
    
    dispatch: function () {
      this.model.dispatch.apply(this.model, arguments);
    },

    render: function (ctx) {
      this.context.item = this.model;
      ModelView.__super__.render.call(this, ctx);
    },
    
    onRender: function () {
      if (this.active_tab) {
        $('a[href='+ this.active_tab + ']').tab('show');
      }
    },
    
    preRender: function () {
      var url = '/workflows/' + this.model.id,
          pview, lview, dview, aview, logview, hview;
      
      this.removeView('tabs');

      pview = this.addTabView(new PaneView({ model: this.model }));
      
      pview.listenTo(this.model, 'change', pview.render);
      
      lview = this.addTabView(new LibraryView({ model: this.model }));
      
      lview.listenTo(this.model, 'change:lib change:wffunc', lview.render);
      
      dview = this.addTabView(new DiagramView({ steps: this.model.mapSteps() }));
      
      logview = this.addTabView(new LogView({ socket_url: url, parent: this }));

      if (this.model.get('has_alerts')) aview = this.addTabView(new AlertsView({ model: this.model }));
      
      hview =  this.setView(new HeaderView({ model: this.model }), '#heading');
    },
            
    close: function (e) {
      if (e) {
        e.preventDefault();  
      }
      
      this.$el.parent()
        .removeClass('show')
        .data('id', null);
      $('.info').removeClass('info');
      this.active_tab = null;
      this.clean();
    },
    
    off: function () {
      this.removeViews();
      this.undelegateEvents();
      this.stopListening();
    },
    
    createDiagram: function () {
      var view = this.getView('#steps');
      
      if (!view) {
        view = this.setView(new DiagramView({ steps: this.model.mapSteps() }), '#steps', true);
      }
      view.render();
    },
    
    onTabChange: function (name) {
      if (name === 'steps') this.createDiagram();
    },
    
    editOption: function (e) {
      var self = this, $tpl;
      
      if (e.target.localName == 'td') {
        var $target  = $(e.currentTarget),
            value    = $target.data('value'),
            obj_type = $target.data('type'),
            name     = $target.data('name'),
            min      = $target.data('min'),
            template = EditTemplate({ 
              value: value,
              type: obj_type ? utils.input_map[obj_type][1] : 'string',
              name: name,
              min: min
            });
        
        $tpl = template;
        $target.toggleClass('editable');
        $target.html($tpl);
        
        this.lock();
        
        $('button[data-action=cancel]', $target).click(function () {
          $target.html(value);
          $target.toggleClass('editable');
        });
        
        $('button[data-action=set]').click(function () {
          var val = $(this).prev('input').val();
          self.setOption(name, val, $target);
        });
        
        $('input').keypress(function (e) {
          if(e.which == 13) {
            self.setOption(name, $(this).val(), $target);
          }
        });
      }
    },
 
    setOption: function (option, value, target) {
      var opts = {}, action = 'set', self = this;

      opts[option] = value;
      action += option.charAt(0).toUpperCase() + option.slice(1);
      
      if (target.data('method')) {
        opts = { options: option +'='+ value };
        action = target.data('method');
      }
      
      this.model.doAction(action, opts, function () {
        self.unlock();
        target.html(value);
        target.addClass('editable');
        target.data('value', value);
      });
    },
    
    runAction: function (e) {
      var data = e.currentTarget.dataset;
      if (data.action) {
        this.model.doAction(data.action);
        e.preventDefault();
      }
    }
    
  });
  
  return ModelView;
});
