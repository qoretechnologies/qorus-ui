define(function(require){
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Backbone    = require('backbone'),
      Dispatcher  = require('qorus/dispatcher'),
      Collection  = require('collections/services'),
      Template    = require('text!templates/service/list.html'),
      TableTpl    = require('text!templates/service/table.html'),
      RowTpl      = require('text!templates/service/row.html'),
      ServiceView = require('views/services/service'),
      ModalView   = require('views/services/modal'),
      Toolbar     = require('views/toolbars/services_toolbar'),
      PaneView    = require('views/common/pane'),
      context, ListView, TableView;
      
  require('jquery.fixedheader');
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
  
  
  TableView = Qorus.TableView.extend({
    initialize: function () {
      _.bindAll(this);
      TableView.__super__.initialize.apply(this, arguments);

      // reset listening events
      this.stopListening(this.collection);
      
      this.listenTo(this.collection, 'add', this.appendRow);
      this.listenTo(this.collection, 'resort sort', this.update);
    }
  })
  
  ListView = Qorus.ListView.extend({
    additionalEvents: {
      "click button[data-option]": "setOption",
      "click button[data-action!='execute']": "runAction",
      "click button[data-action='execute']": "openExecuteModal",
      "click a[data-action]": "runAction"
    },
    
    context: context,
    
    title: "Services",

    initialize: function () {
      var self = this;
      _.bindAll(this);
      this.views = {};
      this.opts = {};
      this.context = {};
      
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
      
      this.listenTo(Dispatcher, 'service:start service:stop service:error service:autostart_change', function (e) {
        var m = self.collection.get(e.info.id);
        if (m) {
         m.fetch();
        }
      });
    },
    
    preRender: function () {
      // init TableView
      var tview = this.setView(new TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          dispatcher: Dispatcher,
          fixed: true
      }), '#service-list');
      
      // assign show detail on row click
      this.listenTo(tview, 'row:clicked', this.showDetail);
      
      // init Toolbar
      this.setView(new Toolbar(), '#service-toolbar');
    },

    onRender: function () {
      $('[data-toggle="tooltip"]').tooltip();
    },

    setOption: function (e) {
      var data = $(e.currentTarget).data();
      var svc = this.collection.get(data.id);

      var opts = data.action ? { 'action': data.action } : {};
      opts[data.option] = data.value;
      $.put(svc.url(), opts, null, 'application/json');
    },
	
    runAction: function (e) {
      debug.log('running action', e);
      var data = e.currentTarget.dataset;
      
      if (data.action) {
        if (data.id == 'selected') {
          this.runBatchAction(data.action, data.method);
        } else if (data.id) {
          debug.log("data action", data.id, data.action);
          // $target.text(data.msg.toUpperCase());
          var inst = this.collection.get(data.id);
          inst.doAction(data.action);           
        }
      }
    },
    
    showDetail: function (row) {
      var view  = this.getView('#service-detail'),
          width = $(document).width() - $('[data-sort="version"]').offset().left,
          id    = (view instanceof Backbone.View) ? view.$el.data('id') : null;
      
      if (id === row.model.id) {
        if (view) view.close();
      } else {
        // add info class to selected row
        row.$el.addClass('info');
        
        // init detail view
        view = this.setView(new PaneView({
          content_view: new ServiceView({ 
            model: row.model, 
            context: this.context 
          }),
          width: width
          }),'#service-detail', true);
        
        // add on close listener
        this.listenToOnce(view, 'closed off', function () {
          row.$el.removeClass('info');
        });
      }
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
    
    openExecuteModal: function (e) {
      var $target = $(e.currentTarget),
          svc = this.collection.get($target.data('serviceid'));

      this.setView(new ModalView({ 
        name: $target.data('methodname'), 
        methods: svc.get('methods'), 
        service_name: svc.get('name') 
      }), '#function-execute', true);
      
      e.stopPropagation();
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
