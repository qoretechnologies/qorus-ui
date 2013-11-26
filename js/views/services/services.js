define(function(require){
  var $           = require('jquery'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Dispatcher  = require('qorus/dispatcher'),
      Collection  = require('collections/services'),
      Template    = require('text!templates/service/list.html'),
      TableTpl    = require('text!templates/service/table.html'),
      RowTpl      = require('text!templates/service/row.html'),
      ServiceView = require('views/services/service'),
      ModalView   = require('views/services/modal'),
      Toolbar     = require('views/toolbars/services_toolbar'),
      PaneView    = require('views/common/pane'),
      fixedhead   = require('jquery.fixedheader'),
      sticky      = require('jquery.sticky'),
      context, ListView;
  
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
  
  
  ListView = Qorus.ListView.extend({
    additionalEvents: {
      "click button[data-option]": "setOption",
      "click button[data-action!='execute']": "runAction",
      "click button[data-action='execute']": "openExecuteModal",
      "click a[data-action]": "runAction",
      "click tr": "showDetail"
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
      this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          dispatcher: Dispatcher,
          fixed: true
      }), '#service-list');
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
      var $target = $(e.currentTarget);
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
    
    showDetail: function (e) {
      var $target = $(e.currentTarget),
          $detail = $('#service-detail'),
          top     = $target.offset().top; // + $target.height()/2;
          view    = this.getView('#service-detail'),
          width   = $(document).width() - $('[data-sort="version"]').offset().left;
      
      if ($target.data('id') && !e.target.localName.match(/(button|a|i)/)) {
        e.stopPropagation();
        
        if ($detail.data('id') == $target.data('id')) {
          if (view) view.close();
        } else {
          // add info class to selected row
          $target.addClass('info');
          
          // init detail view
          view = this.setView(new PaneView({
            content_view: new ServiceView({ 
              model: this.collection.get($target.data('id')), 
              context: this.context 
            }),
            width: width
            }),'#service-detail', true);
          
          // add on close listener
          this.listenToOnce(view, 'closed off', function () {
            $target.removeClass('info');
          })
        }
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
      // this.removeView('#function-execute');
      
      var $target = $(e.currentTarget);

      var svc = this.collection.get($target.data('serviceid'));
      var method = svc.get('methods')[$target.data('id')];

      var modal = this.setView(new ModalView({ 
          name: $target.data('methodname'), 
          methods: svc.get('methods'), 
          service_name: svc.get('name') 
        }), '#function-execute', true);
      
      e.stopPropagation();
    },
    
    enableActions: function (e) {
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
