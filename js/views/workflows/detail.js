define(function (require) {
  var $             = require('jquery'), 
      _             = require('underscore'),
      utils         = require('utils'),
      Qorus         = require('qorus/qorus'),
      LogView       = require('views/log'),
      DiagramView   = require('views/common/diagram'),
      Template      = require('tpl!templates/workflow/meta.html'),
      EditTemplate  = require('tpl!templates/common/option_edit.html'),
      AutostartView = require('views/workflows/autostart'),
      HeaderTpl        = require("tpl!templates/workflow/detail_header.html"),
      ModelView, HeaderView;      

      
  HeaderView = Qorus.View.extend({
    template: HeaderTpl,
    initialize: function (options) {
      this.model = options.model;
    },
    preRender: function () {
      this.context.item = this.model.toJSON();
      this.context.pull_right = false;
      this.setView(new AutostartView({ model: this.model }), '.autostart');
    }
  });
  
  ModelView = Qorus.TabView.extend({
    url: function () {
      return "/" + this.model.id;
    },
    
    additionalEvents: {
      "click a.close-detail": "close",
      "click td[data-editable]": "editOption"
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
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, this.model.api_events, this.dispatch);
      
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
      var url = '/workflows/' + this.model.id;
      this.setView(new LogView({ socket_url: url, parent: this }), '#log');
      this.setView(new HeaderView({ model: this.model }), '#heading');
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
      console.log('tabchange', name);
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
              type: utils.input_map[obj_type][1],
              name: name,
              min: min
            });
        
        $tpl = template;
        $target.toggleClass('editable');
        $target.html($tpl);
        
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
      var opts = {}, action = 'set';

      opts[option] = value;
      action += option.charAt(0).toUpperCase() + option.slice(1);
      
      this.model.doAction(action, opts, function () {
        target.html(value);
        target.addClass('editable');
        target.data('value', value);
      });
    }
    
  });
  
  return ModelView;
});
