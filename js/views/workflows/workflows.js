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
  'views/workflows/detail',
  'jquery.fixedheader',
  'jquery.sticky'
], function($, _, Backbone, Qorus, Collection, Template, date, moment, 
  InstanceListView, Toolbar, BottomBarView, Dispatcher, Modal, TableTpl, RowTpl, WorkflowView){
    
  var ListView = Qorus.ListView.extend({
    timers: [],
    // el: $("#content"),
    additionalEvents: {
      'click tbody tr': 'showDetail',
      'click .action-modal': 'openModal',
      'click .running': 'highlightRunning',
      'click .stopped': 'highlightStopped',
      'contextmenu tbody tr': 'onRightClick'
    },
    
    title: "Workflows",
    
    subviews: {},
    
    initialize: function (collection, date, router, deprecated) {
      _.bindAll(this);
      this.views = {};
      this.opts = {};

      this.router = router;
      this.template = Template;

      this.opts.deprecated = deprecated;
      
      // pass date to options object
      this.date = date;
      
      // call super method
      ListView.__super__.initialize.call(this, Collection, date);
      
      var _this = this;
      this.listenTo(Dispatcher, 'workflow:start workflow:stop workflow:data_submitted workflow:status_changed', function (e, evt) {
        // console.log('Event', evt, e);
        var m = _this.collection.get(e.info.id);
        
        if (m) {
          // console.log(m.attributes);
          if (evt == 'workflow:start') {
            m.incr('exec_count');
          } else if (evt == 'workflow:stop') {
            m.set('exec_count', 0);
          } else if (evt == 'workflow:data_submitted') {
            m.incr(e.info.status);
            m.incr('TOTAL');
          } else if (evt == 'workflow:status_changed') {
            m.incr(e.info.info.new);
            m.decr(e.info.info.old);
          }
          // console.log(m.attributes);
          m.trigger('fetch');
        } 
      });
    },
    
    preRender: function () {
      // this.setView(new BottomBarView(), 'bottombar');
      this.setView(new Toolbar({ date: this.date }), '.toolbar');
      this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          dispatcher: Dispatcher,
          deprecated: this.opts.deprecated
      }), '.workflows');
    },
    
    clean: function () {
      // removes date picker from DOM
      $('.dp').datetimepicker('remove');
    },
    
    onRender: function () {
      $('.table-fixed').fixedHeader({ topOffset: 80 });
      
      if ($('[data-sort="version"]')) {
        var w = $(document).width() - $('[data-sort="version"]').offset().left;
        $('#workflow-detail').outerWidth(w);        
      }
    },
    
    // edit action with Modal window form
    openModal: function (e) {
      var view;
      e.preventDefault();
      e.stopPropagation();
      
      var $target = $(e.currentTarget);
      
      if ($target.data) {
        this.removeView('#modal')
        
        view = this.setView(new Modal({ workflow: this.collection.get($target.data('id')) }), '#modal', true);
        view.render();
        view.open();
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
          console.log($(this).attr('class'));
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

      this.uncheckAll();

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
      
      this.uncheckAll();
      
      $('.workflow-row .instances').each(function () {
        var $this = $(this);
        
        if (parseInt($this.text()) == 0) {
          var id = $this.parent().data('id');
          _this.checkRow(id);
        }
      });
    },
    
    showDetail: function (e) {
      var view = this.getView('#workflow-detail .content');;
      var $target = $(e.currentTarget);
      var $detail = $('#workflow-detail');
      var top = $target.offset().top; // + $target.height()/2;
      
      if ($target.data('id') && !e.target.localName.match(/(button|a)/)) {
        e.stopPropagation();
        
        // remove info class on each row
        $('tr', $target.parent()).removeClass('info');
        
        if ($detail.data('id') == $target.data('id')) {
          if (view) {
            view.close();
          }
        } else {
          this.removeView('#worfklow-detail .content');
          // add info class to selected row
          $target.addClass('info');

          // set current row id
          $detail.data('id', $target.data('id'));
          
          // init detail view
          // console.log(this.$('#workflow-detail'), this.$('#workflow-detail .content'));
          view = this.setView(new WorkflowView({ model: this.collection.get($target.data('id')), context: this.context }), '#workflow-detail .content', true);
          this.$('#workflow-detail').addClass('show');
        }
      }
      
    },
  });
  
  return ListView;

});
