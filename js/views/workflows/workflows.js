define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'collections/workflows',
  'text!../../../templates/workflow/list.html',
  'datepicker',
  'moment',
  'views/workflows/instances',
  'views/toolbars/workflows_toolbar',
  'views/common/bottom_bar',
  'qorus/dispatcher',
  'views/workflows/modal',
  'text!../../../templates/workflow/table.html',
  'text!../../../templates/workflow/row.html',
  'jquery.fixedheader',
  'jquery.sticky'
], function($, _, Backbone, Qorus, Collection, Template, date, moment, 
  InstanceListView, Toolbar, BottomBarView, Dispatcher, Modal, TableTpl, RowTpl){
    
  var ListView = Qorus.ListView.extend({
    // el: $("#content"),
    additionalEvents: {
      'click .action-modal': 'openModal',
      'click .running': 'highlightRunning',
      'click .stopped': 'highlightStopped',
      'contextmenu tr': 'onRightClick'
    },
    
    title: "Workflows",
    
    subviews: {},
    
    initialize: function (collection, date, router, deprecated) {
      _.bindAll(this);
      this.opts = {};

      this.router = router;
      this.template = Template;

      this.opts.deprecated = deprecated;
      
      // pass date to options object
      this.date = date;
      
      // call super method
      ListView.__super__.initialize.call(this, Collection, date);

      // initialize subviews
      this.createSubviews();
      
      var _this = this;
      this.listenTo(Dispatcher, 'workflow:start workflow:stop worfklow:data_submited', function (e) {
        var m = _this.collection.get(e.info.id);
        if (m) {
          m.fetch();
        }
      });
    },
    
    createSubviews: function () {
      this.subviews.bottombar = new BottomBarView();
      this.subviews.toolbar = new Toolbar({ date: this.date });
      this.subviews.table = new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          dispatcher: Dispatcher,
          deprecated: this.opts.deprecated
      });
    },
    
    clean: function () {
      // removes date picker from DOM
      $('.dp').datetimepicker('remove');
    },
    
    onRender: function () {
      // assign toolbar to .toolbar element on render
      this.assign('.toolbar', this.subviews.toolbar);
      this.assign('.workflows', this.subviews.table);
      $('.table-fixed').fixedHeader({ topOffset: 80 });
    },
    
    // edit action with Modal window form
    openModal: function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      var $target = $(e.currentTarget);
      
      if ($target.data) {
        this.subviews.modal = new Modal({ workflow: this.collection.get($target.data('id')) });
        this.assign('#modal', this.subviews.modal);
        this.subviews.modal.open();
      }
      
    },
    
    // do batch action
    runBatchAction: function (action, method, params) {
      var method = method || 'get';
      var ids = this.getCheckedIds();
      var params = { action: action, ids: ids.join(',') };
      
      if (action == 'show' || action == 'hide') {
        params = { action: 'setDeprecated', ids: ids.join(','), deprecated: (action=='hide') }
      }
      
      if (method == 'get') {
        $request = $.get(this.collection.url, params);
      } else if (method == 'put') {
        $request = $.put(this.collection.url, params);
      } else if (method == 'dekete') {
        $request = $.put(this.collection.url, params);
      }
      
      $request
        .done(function (resp){
          console.log(resp);
        });
    },
    
    helpers: {
      getUrl: function (s, id, date) {
        var date = date || this.date || null;
        var params = ['/workflows/view', id, 'orders', s];
    
        if (date) {
          params.push(date);
        }
    
        return params.join('/');
      },
      
      wrapBadge: function (v, u, e){
        var res = '<a href="' + u +'">'+ v +'</a>';
        if (v < 1) {
          return res;
        }
        return '<span class="badge ' + e + '">' + res + '</span>';
      }
    },
    
    loadNextPage: function () {
    },
    
    onRightClick: function (ev) {
      ev.preventDefault();
      var _this = this;
      var $el = $(ev.currentTarget);
      var $menu = $('.context-menu', this.$el);
      var dataId = $el.data('id');
      
      
      $('a', $menu)
        .attr('data-id', dataId)
        .unbind('click')
        .click(function (ev) {
          if ($(this).hasClass('action')) {
            _this.runAction(ev);
          } else if ($(this).hasClass('action-modal')) {
            _this.openModal(ev);
          }

          _.defer(function () {
            $menu.parent().removeClass('open');
          });
        });
      
      $menu.offset({ left: ev.pageX, top: ev.pageY });
      $menu.dropdown('toggle');
    },
    
    highlightRunning: function (e) {
      var _this = this;
      e.preventDefault();
      $('.workflow-row .instances').each(function () {
        var $this = $(this);
        
        if (parseInt($this.text()) > 0) {
          var id = $this.parent().data('id');
          _this.checkRow(id);
        }
      });
    },
    
    highlightStopped: function (e) {
      var _this = this;
      e.preventDefault();
      $('.workflow-row .instances').each(function () {
        var $this = $(this);
        
        if (parseInt($this.text()) == 0) {
          var id = $this.parent().data('id');
          _this.checkRow(id);
        }
      });
    }
  });
  
  return ListView;

});