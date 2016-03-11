define(function (require) {
  var $               = require('jquery'),
      _               = require('underscore'),
      utils           = require('utils'),
      Qorus           = require('qorus/qorus'),
      LogView         = require('views/log'),
      DiagramBaseView = require('views/common/diagram'),
      Template        = require('tpl!templates/workflow/meta.html'),
      DetailTpl       = require('tpl!templates/workflow/info.html'),
      EditTemplate    = require('tpl!templates/common/option_edit.html'),
      AutostartView   = require('views/workflows/autostart'),
      HeaderTpl       = require("tpl!templates/workflow/detail_header.html"),
      LibraryView     = require('views/common/library'),
      AlertsTpl       = require('tpl!templates/common/alerts.html'),
      ModalView       = require('views/common/modal'),
      StepView        = require('views/steps/step'),
      TableEditView   = require('views/common/table.edit'),
      OptionsTpl      = require('tpl!templates/workflow/options.html'),
      ModelView, HeaderView, AlertsView, PaneView, DiagramView, LibView, TEView;

  require('sprintf');

  TEView = TableEditView.extend({
    prepareData: function (data) {
      return { options: _.pick(data, data.name) };
    }
  });

  AlertsView = Qorus.ModelView.extend({
    __name__: 'JobAlertsPaneView',
    name: 'Alerts',
    template: AlertsTpl
  });

  LibView = LibraryView.extend({
    initialize: function () {
      LibView.__super__.initialize.apply(this, arguments);
      this.model.fetch({ data: { lib_source: true }});
    },
    preRender: function () {
      var lib = this.model.get('lib');
      var wffuncs = _.sortBy(this.model.get('wffuncs'), 'name');
      wffuncs = this.transformName(wffuncs, "<small class='label'>%(type)s</small><br />%(name)s", ['name', 'type']);
      _.extend(lib, { wffuncs: wffuncs, stepfuncs: this.mapStepInfo() });
      this.model.set('lib', lib);
      this.context.lib = this.model.get('lib');
    },
    mapStepInfo: function () {
      var stepinfo = this.model.get('stepinfo');
      var steps = [];

      _.each(stepinfo, function (step) {
        _.each(step.functions, function (func) {
					func.header = step.name;
          func.formatted_name = sprintf("<small class='label label-info label-small' title='%s'>%s</small> %s",
            func.type, func.type.slice(0,1).toUpperCase(), func.name);
          steps.push(func);
        });
      });
      return _.chain(steps).unique('name').sortBy('header').value();
    },
    transformName: function (objects, format, attrs) {
      _.each(objects, function (obj) {
        obj.formatted_name = sprintf(format, _.pick(obj, attrs));
      });
      return objects;
    }
  });

  HeaderView = Qorus.View.extend({
    __name__: 'WorkflowHeaderView',
    template: HeaderTpl,

    initialize: function (options) {
      this.context = {};
      this.options = {};
      this.views = {};
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
    name: 'Detail',
    postInit: function () {
      var opts = this.model.getOptions();

      if (opts.length > 0) {
        this.setView(new TEView({ model: this.model, template: OptionsTpl }), '.options');
      }
    }
  });

  DiagramView = DiagramBaseView.extend({
    additionalEvents: {
      "click .box": 'stepDetail'
    },

    stepDetail: function (e) {
      var $target = $(e.currentTarget),
        id = $target.data('id');

      if (id) {
        e.preventDefault();
        e.stopPropagation();
        this.setView(new ModalView({
          content_view: new StepView({ id: id })
        }), '#stepdetail');
      }
    }
  });

  ModelView = Qorus.TabView.extend({
    __name__: "WorkflowDetailView",
    views: {},
    url: function () {
      return this.model.id;
    },

    additionalEvents: {
      "click a.close-view": "closeView",
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
      return this;
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

      lview = this.addTabView(new LibView({ model: this.model }));

      lview.listenTo(this.model, 'change:wffunc', lview.render);

      dview = this.addTabView(new DiagramView({ steps: this.model.mapSteps() }));

      logview = this.addTabView(new LogView({ socket_url: url, parent: this }));

      if (this.model.get('has_alerts')) aview = this.addTabView(new AlertsView({ model: this.model }));

      hview =  this.setView(new HeaderView({ model: this.model, date: this.date }), '#heading');
    },

    closeView: function (e) {
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

    createDiagram: function () {
      var view = this.getView('#steps');

      if (!view) {
        view = this.setView(new DiagramView({ steps: this.model.mapSteps() }), '#steps', true);
      }
      view.render();
    },

    // onTabChange: function (name) {
    //   if (name === 'steps') this.createDiagram();
    // },

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