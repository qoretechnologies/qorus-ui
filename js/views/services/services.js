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
  'sprintf'
], function($, _, Qorus, Dispatcher, Collection, Template, TableTpl, 
  RowTpl, ServiceView, ModalView){
  
  var context = {
      action_css: {
        'reset': 'btn-inverse',
        'load': 'btn-success',
        'unload': 'btn-danger'
      },
      status_label: {
        'loaded': 'label-warning',
        'unloaded': '',
        'running': 'label-success'
      }
  };
  
  
  var ListView = Qorus.ListView.extend({
    additionalEvents: {
      // "click button[data-option]": "setOption",
      "click button[data-action!='execute']": "runAction",
      "click tr": "showDetail",
      "click button[data-action='execute']": "openExecuteModal"
    },
    context: context,
    
    title: "Services",

    initialize: function () {
      _.bindAll(this);
      
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
      
      var _this = this
      this.createSubviews();
      this.listenToOnce(this.collection, 'sync', this.render);
      this.listenTo(Dispatcher, 'service:start service:error service:stop', function (e) {
        console.log('hovno', e);
        _this.updateModels(e);
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
    },

    onRender: function () {
      this.assign('#service-list', this.subviews.table);
      $('[data-toggle="tooltip"]').tooltip();
      
      // TODO: this should be set via jQuery plugin $('#service-detail).pageslide() ?
      if ($('[data-sort="version"]')) {
        var w = $(document).width() - $('[data-sort="version"]').offset().left;
        $('#service-detail').outerWidth(w);        
      }
    },

    setOption: function (e) {
      var data = $(e.currentTarget).data();
      var svc = this.collection.get(data.id);
      var opts = {};
      opts[data.option] = data.value;
      $.put(svc.url(), opts, null, 'application/json');
      this.collection.fetch();
    },
	
    runAction: function (e) {
      e.stopPropagation();
      var $target = $(e.currentTarget);
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        $target.text(data.msg.toUpperCase());
        var inst = this.collection.get(data.id);
        inst.doAction(data.action); 
      }
    },
    
    showDetail: function (e) {
      var _this = this;
      var $target = $(e.currentTarget);
      var $detail = $('#service-detail');
      var top = $target.offset().top; // + $target.height()/2;
      
      if ($target.data('id')) {
        e.stopPropagation();
        
        // remove info class on each row
        $('tr', $target.parent()).removeClass('info');
        
        if ($detail.data('id') == $target.data('id')) {
           $("#service-detail").removeClass('show'); 
           $detail.data('id', null);
        } else {
          // add info class to selected row
          $target.addClass('info');

          // set current row id
          $detail.data('id', $target.data('id'));
          
          // init detail view
          var detail = new ServiceView({ id: $target.data('id'), context: this.context });
          
          if (detail != this.subviews.detail) {
            if (this.subviews.detail){
             this.subviews.detail.undelegateEvents();
            }
            
            this.subviews.detail = detail;
            detail.listenToOnce(detail.model, 'sync', function () {
              _this.assign('#service-detail .content', _this.subviews.detail);
              $('#service-detail').addClass('show');
            });
          }
          
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
    }
    
    
  });

  return ListView;
});
