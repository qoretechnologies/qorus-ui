define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/services',
  'text!../../../templates/service/list.html',
  'text!../../../templates/service/table.html',
  'text!../../../templates/service/row.html',
  'views/services/service',
  'views/services/modal',
  'views/toolbars/services_toolbar',
  'jquery.fixedheader',
  'jquery.sticky',
  'sprintf'
], function($, _, Qorus, Dispatcher, Collection, Template, TableTpl, 
  RowTpl, ServiceView, ModalView, Toolbar){
  
  var context = {
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
  
  
  var ListView = Qorus.ListView.extend({
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
          dispatcher: Dispatcher
      }), '#service-list');
      // this.setView(new Toolbar(), '#service-toolbar');
    },

    onRender: function () {
      $('[data-toggle="tooltip"]').tooltip();
      
      // TODO: this should be set via jQuery plugin $('#service-detail).pageslide() ?
      if ($('[data-sort="version"]')) {
        var w = $(document).width() - $('[data-sort="version"]').offset().left;
        this.$('#service-detail').outerWidth(w);        
      }
      // this.$('.table-fixed').fixedHeader({ topOffset: 80 });
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
      var $target = $(e.currentTarget);
      var $detail = $('#service-detail');
      var top = $target.offset().top; // + $target.height()/2;
      var view = this.getView('#service-detail .content');
      
      if ($target.data('id') && !e.target.localName.match(/(button|a)/)) {
        e.stopPropagation();
        
        // remove info class on each row
        $('tr', $target.parent()).removeClass('info');
        
        if ($detail.data('id') == $target.data('id')) {
          $detail.removeClass('show');
        } else {
          // add info class to selected row
          $target.addClass('info');
          
          // console.log('setting view', $target.data('id'), this.collection.get($target.data('id')), this.context);
          // init detail view
          view = this.setView(new ServiceView({ 
              model: this.collection.get($target.data('id')), 
              context: this.context 
            }), '#service-detail .content', true);
          
          // set current row id
          $detail.data('id', $target.data('id'));
          $detail.addClass('show');
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
