define(function (require) {
  var Backbone    = require('backbone'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Role        = require('models/role'),
      Roles       = require('collections/roles'),
      Template    = require('tpl!templates/system/rbac/roles.html'),
      TableTpl    = require('text!templates/system/rbac/roles/table.html'),
      RowTpl      = require('text!templates/system/rbac/roles/row.html'),
      RoleTpl     = require('tpl!templates/system/rbac/roles/detail.html'),
      PaneView    = require('views/common/pane'),
      ModalView   = require('views/common/modal'),
      ModalTpl    = require('tpl!templates/system/rbac/roles/modal.html'),
      Permissions = require('collections/permissions'),
      Forms       = require('views/system/rbac/forms'),
      Users       = require('collections/users'),
      Groups      = require('collections/groups'),
      ItemsViews  = require('qorus/views/items'),
      BaseToolbar = require('views/toolbars/toolbar'),
      ToolbarTpl  = require('tpl!templates/system/rbac/roles/toolbar.html'),
      View, DetailView, Modal, RowView, Toolbar;

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
      return '/' + this.model.get('role');
    },
    template: RoleTpl, 
    tabs: {
      'permissions': {
        view: ItemsViews.ListingView,
        options: {
          collection: new Permissions().fetch(),
          name: 'Permissions'
        }
      },
      'users': {
        view: ItemsViews.ListingView,
        options: {
          collection: new Users().fetch(),
          name: 'Users',
          readonly: true
        }
      },
      'groups': {
        view: ItemsViews.ListingView,
        options: {
          collection: new Groups().fetch(),
          name: 'Groups'
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
  
  // Roles listing view
  View = Qorus.ListView.extend({
    additionalEvents: {
      "click .add-role": 'showAddView'
    },
    url: "/roles",
    collection: new Roles(),
    template: Template,
    preRender: function () {
      var TView = this.setView(new Qorus.TableView({
        url: "/roles",
        collection: this.collection, 
        template: TableTpl, 
        row_template: RowTpl,
        row_view: RowView
      }), '#role-list');
      
      this.listenTo(TView, 'row:clicked', this.showDetail);
      this.listenTo(TView, 'row:edit', this.showEditView);
      this.listenTo(TView, 'row:clone', this.showCloneView);
      
      this.setView(new Toolbar({ template: ToolbarTpl }), '.toolbar');
    },
    showDetail: function (row) {
      var view  = this.getView('#role-detail-view'),
          model = row.model,
          url = this.getViewUrl();
      
      if (this.selected_model != model) {
        this.selected_model = model;
        
        view = this.setView(new PaneView({ 
          url: '/' + row.model.get('role'),
          model: row.model,
          content_view: new DetailView({
            model: model,
            template: RoleTpl
          })
        }), '#role-detail-view', true);
        
        view.render();
        
        this.listenToOnce(view, 'off closed', function () {
          row.$el.removeClass('info');
        });
        row.$el.addClass('info');

        url = [this.getViewUrl(), row.model.id].join('/');  
      } else {
        if (view) view.closeView();
        if (this.selected_model) this.stopListening(this.selected_model);
        this.selected_model = null;
      }
      Backbone.history.navigate(url);
    },
    showAddView: function () {
      var form = new Forms.Role({
          model: new Role(),
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
      var form = new Forms.Role({
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
    },
    showCloneView: function (model) {
      var clone, form, wrap, modal, name;
      
      clone = model.clone();
      name = clone.get('role');
      delete clone.collection;
      clone.set('role', name + '_copy');
      
      form = new Forms.Role({
          model: clone,
          collection: this.collection
      });
      
      wrap = new Qorus.View();
      wrap.insertView(form, 'self');
      
      modal = this.setView(new Modal({
        content_view: wrap
      }));
      modal.context.edit = true;
      
      modal.listenTo(form, 'close', modal.hide);
    }
  });
  
  return View;
});
