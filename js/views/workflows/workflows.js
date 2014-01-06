define(function (require) {
  var $                = require('jquery'),
      _                = require('underscore'),
      Qorus            = require('qorus/qorus'),
      utils            = require('utils'),
      Collection       = require('collections/workflows'),
      Template         = require('text!templates/workflow/list.html'),
      date             = require('datepicker'),
      moment           = require('moment'),
      InstanceListView = require('views/workflows/instances'),
      Toolbar          = require('views/toolbars/workflows_toolbar'),
      BottomBarView    = require('views/common/bottom_bar'),
      Dispatcher       = require('qorus/dispatcher'),
      Modal            = require('views/workflows/modal'),
      TableTpl         = require('text!templates/workflow/table.html'),
      RowTpl           = require('text!templates/workflow/row.html'),
      WorkflowView     = require('views/workflows/detail'),
      PaneView         = require('views/common/pane'),
      ListView;


  ListView = Qorus.ListView.extend({
    cls: "workflows.ListView",
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
    
    initialize: function (collection, date, router, deprecated) {
      var self = this;
      _.bindAll(this);
      this.views = {};
      this.opts = {};
      this.context = {};

      this.router = router;
      this.template = Template;

      this.opts.deprecated = deprecated;
      
      // pass date to options object
      this.date = date;
      
      // call super method
      ListView.__super__.initialize.call(this, Collection, date);
      
      // reassign listening events to collection
      this.stopListening(this.collection);
      
      debug.log(this.views);
      
      this.listenToOnce(this.collection, 'sync', self.render);
      
      this.listenTo(Dispatcher, 'workflow:start workflow:stop workflow:data_submitted workflow:status_changed', function WFLDISPATCH(e, evt) {
        // debug.log('Event', evt, e);
        var m = self.collection.get(e.info.id);
        
        if (m) {
          // debug.log(m.attributes);
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
          // debug.log(m.attributes);
          m.trigger('fetch');
        } 
      });
    },
    
    preRender: function () {
      // this.setView(new BottomBarView(), 'bottombar');
      var helpers = _.extend({ date: this.date }, this.helpers);
      
      this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: helpers,
          dispatcher: Dispatcher,
          deprecated: this.opts.deprecated,
          fixed: true
      }), '.workflows');
      this.setView(new Toolbar({ date: this.date, parent: this }), '.toolbar');
    },
    
    clean: function () {
      // removes date picker from DOM
      $('.dp').datetimepicker('remove');
      this.$('.table-fixed').fixedHeader('remove');
    },
    
    // edit action with Modal window form
    openModal: function (e) {
      var view;
      e.preventDefault();
      e.stopPropagation();
      
      var $target = $(e.currentTarget);
      
      if ($target.data) {
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
          debug.log(resp);
        });
    },
    
    helpers: {
        getUrl: function (s, id, date) {
              var date = date || this.date || null;
              var params = ['/workflows/view', id, 'orders', s];
    
              if (date) {
                // encode for URL
                date = utils.encodeDate(date);
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
      
      var self = this;
      var $el = $(ev.currentTarget);
      var $menu = $('.context-menu', this.$el);
      var dataId = $el.data('id');
      
      
      this.$('a', $menu)
        .attr('data-id', dataId)
        .unbind('click')
        .click(function WFLMENUC(ev) {
          debug.log($(this).attr('class'));
          if ($(this).hasClass('action')) {
            self.runAction(ev);
          } else if ($(this).hasClass('action-modal')) {
            self.openModal(ev);
          }
          
          _.defer(function () {
            $menu.parent().removeClass('open');
          });
        });
      
      $menu.offset({ left: ev.pageX, top: ev.pageY });
      $menu.dropdown('toggle');
    },
    
    highlightRunning: function (e) {
      var self = this;
      e.preventDefault();

      this.uncheckAll();

      $('.workflow-row .instances').each(function WFLHILITER() {
        var $this = $(this);
        
        if (parseInt($this.text()) > 0) {
          var id = $this.parent().data('id');
          self.checkRow(id);
        }
      });
    },
    
    highlightStopped: function (e) {
      var self = this;
      e.preventDefault();
      
      this.uncheckAll();
      
      $('.workflow-row .instances').each(function WFLHILITES() {
        var $this = $(this);
        
        if (parseInt($this.text()) == 0) {
          var id = $this.parent().data('id');
          self.checkRow(id);
        }
      });
    },
    
    showDetail: function (e) {
      var view    = this.getView('#workflow-detail'),
          $target = $(e.currentTarget),
          $detail = $('#workflow-detail'),
          top     = $target.offset().top; // + $target.height()/2;
          width   = $(document).width() - $('[data-sort="version"]').offset().left;
      
      if ($target.data('id') && !e.target.localName.match(/(button|a|i)/)) {
        e.stopPropagation();
                
        if ($detail.data('id') == $target.data('id')) {
          if (view) view.close();
        } else {
          $target.addClass('info');
          
          // init detail view
          var model = this.collection.get($target.data('id'));
          view = this.setView(new PaneView({ 
              content_view: new WorkflowView({ 
                model: model, 
                context: this.context 
              }),
              width: width
            }), '#workflow-detail', true);
          
            this.listenToOnce(view, 'closed off', function () {
              $target.removeClass('info');
            });
        }
      }
      
    }
  });
  
  return ListView;

});
