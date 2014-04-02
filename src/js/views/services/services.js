define(function(require){
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Backbone    = require('backbone'),
      Collection  = require('collections/services'),
      Template    = require('text!templates/service/list.html'),
      TableTpl    = require('text!templates/service/table.html'),
      RowTpl      = require('text!templates/service/row.html'),
      ServiceView = require('views/services/service'),
      ModalView   = require('views/services/modal'),
      Toolbar     = require('views/toolbars/services_toolbar'),
      PaneView    = require('views/common/pane'),
      helpers     = require('qorus/helpers'),
      context, ListView, TableView, RowView;
      
  require('jquery.fixedheader');
  
  context = {
      action_css: {
        'reset': 'btn-inverse',
        'load': 'btn-success',
        'unload': 'btn-danger'
      },
      status_label: {
        'loaded': 'warning',
        'unloaded': '',
        'running': 'success'
      }
  };
  
  RowView = Qorus.RowView.extend({
    __name__: 'ServiceRowView',
    additionalEvents: {
      "click button[data-option]": "setOption",
      "click button[data-action!='execute']": "runAction",
      'click [data-action]': 'doAction'
    },
    
    // sets model option
    setOption: function (evt) {
     var data = $(evt.currentTarget).data(),
         opts = data.action ? { 'action': data.action } : {};

      opts[data.option] = data.value; 
      
      this.model.setOption(opts);
    },
    
    // run model specific actions
    runAction: function (evt) {
      var $target = $(evt.currentTarget);
      // console.log('halo', arguments);
      this.model.doAction($target.data('action'), $target.data());
      evt.stopPropagation();
    },
    
    showAlert: function () {
      var url, alert;
      var alerts = this.model.get('alerts');
      
      if (alerts.length < 1) return;

      alert = alerts[0];
      url = [helpers.getUrl('showSystem'), 'alerts', alert.alerttype.toLowerCase(), alert.id].join('/');
      // console.log(url, helpers.getUrl('showSystem'));
      
      Backbone.history.navigate(url, { trigger: true });
    },
    
    doAction: function (e) {
      var $target = $(e.currentTarget),
          action = $target.data('action');
      
      e.stopPropagation();
      e.preventDefault();
      this.model.doAction(action, $target.data());
    }
  });

  
  TableView = Qorus.TableView.extend({
    row_view: RowView,
    
    initialize: function () {
      TableView.__super__.initialize.apply(this, arguments);
      // this.RowView = RowView;

      // reset listening events
      this.stopListening(this.collection);
      
      this.listenTo(this.collection, 'add', this.appendRow);
      this.listenTo(this.collection, 'resort sort', this.update);
    }
  });
  
  ListView = Qorus.ListView.extend({
    __name__: "ServicesListView",
    url: '/services',
    context: context,
    
    title: "Services",

    initialize: function (options) {
      this.options = {};
      this.views = {};
      this.opts = options || {};
      
      if (this.opts.path) this.path = this.opts.path;
      
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
    },
    
    onProcessPath: function (path) {
      var id = path.split('/')[0];
      
      if (id) this.detail_id = id;
    },
    
    preRender: function () {
      // init TableView
      var tview = this.setView(new TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          fixed: true
      }), '#service-list');
      
      // assign show detail on row click
      this.listenTo(tview, 'row:clicked', this.showDetail);
      
      // init Toolbar
      this.setView(new Toolbar(), '#service-toolbar');
    },

    onRender: function () {
      var model;
      $('[data-toggle="tooltip"]').tooltip();
      
      if (this.detail_id) {
        // TODO: needs fix - not working with prerendering
        model = this.collection.get(this.detail_id);
        if (model) model.trigger('rowClick');
      }
    },

    showDetail: function (row) {
      var self  = this,
          view  = this.getView('#service-detail'),
          width = $(document).width() - $('[data-sort="version"]').offset().left,
          id    = (view instanceof Backbone.View) ? view.$el.data('id') : null,
          model = row.model,
          content_view, url;
      
      if (id === row.model.id) {
        if (view) view.close();
        url = this.getViewUrl();
      } else {
        // add info class to selected row
        row.$el.addClass('info');
        
        // init content view
        content_view = new ServiceView({ 
          model: row.model, 
          context: this.context 
        });
        
        // add listener - for some reason it doesn't work inside ServiceView
        // this.listenTo(model, 'change', content_view.render);
        this.listenTo(content_view, 'modal:open', this.openExecuteModal);
        
        // init detail view
        view = this.setView(new PaneView({
          content_view: content_view,
          width: width
          }),'#service-detail', true);
      
        view.render();
        
        // add on close listener
        this.listenToOnce(view, 'closed off', function () {
          row.$el.removeClass('info');
          self.stopListening(content_view);
          self.stopListening(model);
        });
        
        url = [this.getViewUrl(), model.id].join('/');
      }
      
      Backbone.history.navigate(url);
      
    },
    
    // open service method execution modal
    // TODO: it would be better to run inside Service Detail view,
    // but it has CSS position issues. try to fix later
    openExecuteModal: function (model, method) {
      var view = this.setView(new ModalView({ 
        name: method, 
        methods: model.get('methods'), 
        service_name: model.get('name') 
      }), '#function-execute', true);
      view.render();
    },
    
    helpers:  {
      // getLabel: function (status) {
      //   return context.status_label[status];
      // },
      getLabel: function (status) {
        var status_label = {
          'loaded': 'warning',
          'unloaded': '',
          'running': 'success'
        };
        return status_label[status];
      },
      action_css: {
        'reset': 'btn-inverse',
        'load': 'btn-success',
        'unload': 'btn-danger'
      }
    },
    
    enableActions: function () {
      var ids = this.getCheckedIds();
      
      if (ids.length > 0) {
        $('.toolbar-actions', this.$el).removeClass('hide');
      } else {
        $('.toolbar-actions', this.$el).addClass('hide');
      }
    },
    
    clean: function () {
      // console.log(this.$('.table-fixed'));
      this.$('.table-fixed').fixedHeader('remove');
    }
  });

  return ListView;
});
