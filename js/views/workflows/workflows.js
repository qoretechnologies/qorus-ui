define(function (require) {
  var _            = require('underscore'),
      Qorus        = require('qorus/qorus'),
      Collection   = require('collections/workflows'),
      Template     = require('text!templates/workflow/list.html'),
      Toolbar      = require('views/toolbars/workflows_toolbar'),
      Dispatcher   = require('qorus/dispatcher'),
      Modal        = require('views/workflows/modal'),
      TableTpl     = require('text!templates/workflow/table.html'),
      RowTpl       = require('text!templates/workflow/row.html'),
      WorkflowView = require('views/workflows/detail'),
      PaneView     = require('views/common/pane'),
      utils        = require('utils'),
      helpers      = require('views/workflows/helpers'),
      ListView, RowView;

  // extending base RowView to add workflow related events
  RowView = Qorus.RowView.extend({
    __name__: 'WorkflowRowView',
    
    additionalEvents: {
      'click .connalert': 'showAlert',
      'click [data-action]': 'doAction'
    },
    
    showAlert: function () {
      var url, alert;
      var alerts = this.model.get('alerts');
      
      if (alerts.length < 1) return;

      alert = alerts[0];
      url = [helpers.getUrl('showSystem'), 'alerts', alert.alerttype.toLowerCase(), alert.id].join('/');
      console.log(url, helpers.getUrl('showSystem'));
      
      Backbone.history.navigate(url, { trigger: true });
    },
    
    doAction: function (e) {
      var $target = $(e.currentTarget),
          action = $target.data('action');
      
      e.stopPropagation();
      e.preventDefault();
      this.model.doAction(action);
    }
  });

  ListView = Qorus.ListView.extend({
    __name__: "WorkflowListView",
    url: function () {
      return helpers.getUrl('showWorkflows').replace(/\/$/, "");
    },
    
    cls: "workflows.ListView",
    timers: [],
    // el: $("#content"),
    additionalEvents: {
      'click .action-modal': 'openModal',
      'click .running': 'highlightRunning',
      'click .stopped': 'highlightStopped',
      'contextmenu tbody tr': 'onRightClick'
    },
    
    title: "Workflows",
    
    initialize: function (collection, options, router, deprecated) {
      var self = this;
      this.views = {};
      this.opts = options || {};
      this.context = {};
      
      this.template = Template;
      
      // pass date to options object
      this.date = this.opts.date;
      
      this.opts.deprecated = deprecated ? true : false;
      
      // call super method
      ListView.__super__.initialize.call(this, Collection, this.date);
      
      // reassign listening events to collection
      this.stopListening(this.collection);
      
      debug.log(this.views);
      
      this.listenToOnce(this.collection, 'sync', self.render);
      this.processPath(this.opts.path);
    },
    
    onProcessPath: function (path) {
      var id = path.split('/')[0];
      
      if (id) this.detail_id = id;
    },
    
    preRender: function () {
      // this.setView(new BottomBarView(), 'bottombar');
      var helpers = _.extend({ date: this.date }, this.helpers),
          tview;
      
      // create workflows table
      tview = this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          row_view: RowView,
          helpers: helpers,
          dispatcher: Dispatcher,
          deprecated: this.opts.deprecated,
          fixed: true
      }), '.workflows');

      // add listener to rowclick
      this.listenTo(tview, 'row:clicked', this.showDetail);
      
      this.setView(new Toolbar({ date: this.date, parent: this }), '.toolbar');
    },
    
    onRender: function () {
      if (parseInt(this.detail_id, 10)) {
        this.collection.get(this.detail_id).trigger('rowClick');
      }
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
      var ids = this.getCheckedIds(),
        $request;

      method = method || 'get';
      params = { action: action, ids: ids.join(',') };
      
      if (action == 'show' || action == 'hide') {
        params = { action: 'setDeprecated', ids: ids.join(','), deprecated: (action=='hide') };
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
    
    helpers: _.extend(_.clone(helpers), {
        getUrl: function (s, id, date) {
              var params = ['/workflows/view', id, 'orders', s];
              date = date || this.date || null;
    
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
    }),
    
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
        
        if (parseInt($this.text(), 10) > 0) {
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
        
        if (parseInt($this.text(), 10) === 0) {
          var id = $this.parent().data('id');
          self.checkRow(id);
        }
      });
    },
    
    showDetail: function (row) {
      var self    = this,
          view    = this.getView('#workflow-detail'),
          $detail = $('#workflow-detail'),
          id      = (view instanceof Backbone.View) ? view.$el.data('id') : null,
          width   = $(document).width() - $('[data-sort="version"]').offset().left,
          model   = row.model,
          content_view, url;
      
      // set pane width
      $detail.width(width);
      
      if (id === model.id) {
        if (view) view.close();
        url = this.url();
        this.detail_id = null;
      } else {
        row.$el.addClass('info');
        
        content_view = new WorkflowView({
          model: model,
          context: this.context
        });
        
        // add listener - for some reason it doesn't work inside ServiceView
        this.listenTo(model, 'change', content_view.render);

        // init detail view
        view = this.setView(new PaneView({ 
            content_view: content_view,
            width: width
          }), '#workflow-detail', true);
        
          this.listenToOnce(view, 'closed off', function () {
            row.$el.removeClass('info');
            self.stopListening(content_view);
            self.stopListening(model);
          });

        url = helpers.getUrl('showWorkflows') + row.model.id;
        this.detail_id = row.model.id;
      }
      
      Backbone.history.navigate(url);
    }
  });
  
  return ListView;

});
