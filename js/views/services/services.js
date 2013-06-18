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
      "click a[data-action^='execute']": "runAction",
      "click button[data-action]": "runAction",
      "click button[data-action='execute']": "openExecuteModal",
      "click tr": "showDetail"
    },
    
    context: context,
    
    title: "Services",

    initialize: function () {
      _.bindAll(this);
      
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
      
      this.createSubviews();
      this.listenToOnce(this.collection, 'sync', this.render);
      
      var _this = this;
      this.listenTo(Dispatcher, 'service:start service:stop service:error', function (e) {
        var m = _this.collection.get(e.info.id);
        if (m) {
          m.fetch();
        }
      });
    },
    
    createSubviews: function () {
      this.subviews.table = new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          dispatcher: Dispatcher
      });
      this.subviews.toolbar = new Toolbar();
    },

    onRender: function () {
      this.assign('#service-list', this.subviews.table);
      this.assign('#service-toolbar', this.subviews.toolbar);
      $('[data-toggle="tooltip"]').tooltip();
      
      // TODO: this should be set via jQuery plugin $('#service-detail).pageslide() ?
      if ($('[data-sort="version"]')) {
        var w = $(document).width() - $('[data-sort="version"]').offset().left;
        $('#service-detail').outerWidth(w);        
      }
      $('.table-fixed').fixedHeader({ topOffset: 80 });
    },

    setOption: function (e) {
      var data = $(e.currentTarget).data();
      var svc = this.collection.get(data.id);

      var opts = data.action ? { 'action': data.action } : {};
      opts[data.option] = data.value;
      $.put(svc.url(), opts, null, 'application/json');
    },
	
    runAction: function (e) {
      console.log('running action', e, this.isEnabled(e));
      var $target = $(e.currentTarget);
      var data = e.currentTarget.dataset;
      
      if (this.isEnabled(e) && data.action) {
        if (data.id == 'selected') {
        } else if (data.id) {
          console.log("data action", data.id, data.action);
          // $target.text(data.msg.toUpperCase());
          var inst = this.collection.get(data.id);
          inst.doAction(data.action);           
        }
      }
      
    },
    
    showDetail: function (e) {
      var _this = this;
      var $target = $(e.currentTarget);
      var $detail = $('#service-detail');
      var top = $target.offset().top; // + $target.height()/2;
      
      if ($target.data('id') && !e.target.localName.match(/(button|a)/)) {
        e.stopPropagation();
        
        // remove info class on each row
        $('tr', $target.parent()).removeClass('info');
        
        if ($detail.data('id') == $target.data('id')) {
          if (this.subviews.detail) {
            this.subviews.detail.close();
          }
        } else {
          // add info class to selected row
          $target.addClass('info');

          // set current row id
          $detail.data('id', $target.data('id'));

          // clean prev view
          if (this.subviews.detail){
            this.subviews.detail.clean();
          }
          
          // init detail view
          var detail = new ServiceView({ model: this.collection.get($target.data('id')), context: this.context });

          this.subviews.detail = detail;
          this.assign('#service-detail .content', detail);
          $('#service-detail').addClass('show');
          
          // detail.listenTo(detail.model, 'sync', function () {
          //   $('#service-detail').addClass('show');
          // });
          
        }
      }
      
    },
    
    helpers:  {
      getLabel: function (status) {
        return context.status_label[status];
      },
      action_css: context.action_css
    },
    
    openExecuteModal: function (e) {
      var $target = $(e.currentTarget);

      var svc = this.collection.get($target.data('serviceid'));
      var method = svc.get('methods')[$target.data('id')];

      var modal = new ModalView({ name: $target.data('methodname'), methods: svc.get('methods'), service_name: svc.get('name') });
      
      if (this.subviews.modal) {
        this.subviews.modal.undelegateEvents();  
      }
      
      this.subviews.modal = modal;
      
      this.assign('#function-execute', modal);
    },
    
    highlight: function (ev) {
      console.log("service highlite");
      ListView.__super__.highlight.call(this, ev);
      this.enableActions();
    },
    
    enableActions: function (e) {
      console.log('Enabling actions');
      this.$el.find('#service-toolbar button[data-action]').toggleClass('disabled');
    }
    
  });

  return ListView;
});
