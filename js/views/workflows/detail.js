define([
  'jquery',
  'underscore',
  'utils',
  'qorus/qorus',
  'qorus/dispatcher',
  'models/workflow',
  'views/log',
  'views/common/diagram',
  'text!../../../templates/workflow/meta.html',
  'text!../../../templates/common/option_edit.html',
  'jquery.ui'
], function ($, _, utils, Qorus, Dispatcher, Model, LogView, DiagramView, Template, EditTemplate) {
  
  var ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": "tabToggle",
      "click a.close-detail": "close",
      "click td[data-editable]": "editOption"
    },
    
    initialize: function (opts) {
      this.opts = opts;
      this.views = {};
      _.bindAll(this);
      
      this.template = Template;
      
      if (_.has(opts, 'context')) {
        _.extend(this.context, opts.context);
      }
      
      this.model = new Model({ id: this.opts.model.id });
      this.listenTo(this.model, 'change', this.render);
      this.model.fetch();
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
      // this.setView(new LogView({ socket_url: url, parent: this }), '#log');
    },
    
    createDiagram: function () {
      var view;
      this.removeView('#steps');
      
      view = this.setView(new DiagramView({ steps: this.model.mapSteps() }), '#steps', true);
      view.render();
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
        this.getViews('#log').fixHeight();
      }

      this.active_tab = $target.attr('href');
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
    },
    
    off: function () {
      this.removeViews();
      this.undelegateEvents();
      this.stopListening;
    },
    
    editOption: function (e) {
      var _this = this;
      
      if (e.target.localName == 'td') {
        var $target = $(e.currentTarget);
        var value = $target.data('value');
        var obj_type = $target.data('type');
        var name = $target.data('name');
        var template = _.template(EditTemplate, { 
          value: value,
          type: utils.input_map[obj_type][1],
          name: name
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
          _this.setOption(name, val, $target);
        });
        
        $('input').keypress(function (e) {
          if(e.which == 13) {
            _this.setOption(name, $(this).val(), $target);
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