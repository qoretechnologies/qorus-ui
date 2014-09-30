define(function (require) {
  var Qorus       = require('qorus/qorus'),
      _           = require('underscore'),
      Users       = require('collections/users'),
      Template    = require('tpl!templates/system/rbac/users.html'),
      TableTpl    = require('text!templates/system/rbac/users/table.html'),
      RowTpl      = require('text!templates/system/rbac/users/row.html'),
      Forms       = require('views/system/rbac/forms'),
      ItemsViews  = require('qorus/views/items'),
      ModalView   = require('views/common/modal'),
      ModalTpl    = require('tpl!templates/system/rbac/users/modal.html'),
      UserTpl     = require('tpl!templates/system/rbac/users/detail.html'),
      Roles       = require('collections/roles'),
      PaneView    = require('views/common/pane'),
      User        = require('models/user'),
      BaseToolbar = require('views/toolbars/toolbar'),
      ToolbarTpl  = require('tpl!templates/system/rbac/users/toolbar.html'),
      View, Modal, DetailView, RowView, Toolbar;

  Toolbar = BaseToolbar.extend({
    fixed: false
  });

  Modal = ModalView.extend({ 
    template: ModalTpl,
    additionalEvents: {
      "submit": 'delegateSubmit',
      "click button[type=submit]": 'delegateSubmit'
    },
    delegateSubmit: function (e) {
      this.$('form').trigger('submit', e);
    }
  });

  // Right pane detail view
  DetailView = Qorus.TabView.extend({
    url: function () {
      return '/' + this.model.get('username');
    },
    template: UserTpl, 
    tabs: {
      'roles': {
        view: ItemsViews.ListingView,
        options: {
          collection: new Roles().fetch(),
          name: 'Roles'
        }
      }
    },
    preRender: function () {
      this.context.item = this.model.toJSON();
    },
    render: function () {
      DetailView.__super__.render.apply(this, arguments);
      return this;
    },
    close: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    },
    renderTabs: function () {
      _.each(this.getTabs(), function (tab) {
        var id = '#' + tab.id();
        tab.setElement(this.$(id));
        tab.render();
      });
    }
  });

  RowView = Qorus.RowView.extend({
    additionalEvents: {
      "click [data-action]": 'doAction'
    },
    postInit: function () {
      this.listenTo(this.model, 'change', this.render);
    },
    doAction: function (e) {
      var $target = $(e.currentTarget),
          opts    = $target.data();
  
      if (opts.action == 'edit') {
        this.trigger('edit', this.model);
        this.parent.trigger('row:edit', this.model);
      } else if (opts.action == 'clone') {
        this.trigger('clone', this.model);
        this.parent.trigger('row:clone', this.model);
      } else {
        this.model.doAction(opts);
      }
    }
  });

  View = Qorus.ListView.extend({
    collection: new Users(),
    template: Template,
    additionalEvents: {
      "click .add-user": 'showAddView'
    },
    preRender: function () {
      var TView = this.setView(new Qorus.TableView({ 
        collection: this.collection, 
        template: TableTpl, 
        row_template: RowTpl,
        row_view: RowView
      }), '#user-list');
    
      this.listenTo(TView, 'row:clicked', this.showDetail);
      this.listenTo(TView, 'row:edit', this.showEditView);
      this.listenTo(TView, 'row:clone', this.showCloneView);
      
      this.setView(new Toolbar({ template: ToolbarTpl }), '.toolbar');
    },
    showDetail: function (row) {
      var view  = this.getView('#user-detail-view'),
          model = row.model,
          url = this.getViewUrl();
      
      if (this.selected_model != model) {
        this.selected_model = model;
        
        view = this.setView(new PaneView({ 
          url: '/' + row.model.get('role'),
          model: row.model,
          content_view: new DetailView({
            model: model
          })
        }), '#user-detail-view', true);
        
        view.render();
        
        this.listenToOnce(view, 'off closed', function () {
          row.$el.removeClass('info');
        });
        row.$el.addClass('info');

        url = [this.getViewUrl(), row.model.id].join('/');  
      } else {
        if (view) view.close();
        if (this.selected_model) this.stopListening(this.selected_model);
        this.selected_model = null;
      }
      Backbone.history.navigate(url);
    },
    showAddView: function () {
      var form = new Forms.User({
          model: new User(),
          collection: this.collection
      });
      
      var wrap = new Qorus.View();
      wrap.insertView(form, 'self');
      
      var modal = this.setView(new Modal({
        content_view: wrap
      }));
      
      modal.listenTo(form, 'close', modal.hide);
    },
    showEditView: function (model) {
      var form = new Forms.UserEdit({
          model: model,
          collection: this.collection
      });
      
      var wrap = new Qorus.View();
      wrap.insertView(form, 'self');
      
      var modal = this.setView(new Modal({
        content_view: wrap,
        edit: true
      }));
      modal.context.edit = true;
      
      modal.listenTo(form, 'close', modal.hide);
    }
  });
  
  return View;
});
