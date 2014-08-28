define(function (require) {
  var Backbone       = require('backbone'),
      _              = require('underscore'),
      Qorus          = require('qorus/qorus'),
      Role           = require('models/role'),
      Roles          = require('collections/roles'),
      Template       = require('tpl!templates/system/rbac/roles.html'),
      TableTpl       = require('text!templates/system/rbac/roles/table.html'),
      RowTpl         = require('text!templates/system/rbac/roles/row.html'),
      RoleTpl        = require('tpl!templates/system/rbac/roles/detail.html'),
      PaneView       = require('views/common/pane'),
      ModalView      = require('views/common/modal'),
      ModalTpl       = require('tpl!templates/system/rbac/roles/modal.html'),
      ListingViewTpl = require('tpl!templates/common/listing.html'),
      Permissions    = require('collections/permissions'),
      ItemTpl        = require('tpl!templates/common/item.html'),
      EditTpl        = require('tpl!templates/system/rbac/roles/edit.html'),
      Forms          = require('views/system/rbac/forms'),
      View, DetailView, Modal, ListingView, EditView;

  
  Modal = ModalView.extend({ 
    template: ModalTpl,
    additionalEvents: {
      "click button[type=submit]": 'createRole',
      "submit": "createRole"
    },
    createRole: function (e) {
      console.log(this.$('form').serialize());
    }
  });
  
  ItemView = Qorus.View.extend({
    additionalEvents: {
      'click .remove': 'removeItem'
    },
    template: ItemTpl,
    removeItem: function () {
      this.trigger('item:remove', this.options.item);
      this.off();
    }
  });
  
  // Role detail attribute listing
  ListingView = Qorus.View.extend({
    additionalEvents: {
      'click .add-item': 'addItem',
      'click .remove-item': 'removeItem'
    },
    template: ListingViewTpl,
    onRender: function () {
      var items = this.model.get(this.name);
      if (_.size(items) > 0) {
        this.addItems(items.sort());
      }
    },
    addItem: function (item) {
      var view = this.insertView(new ItemView({ item: item }), '.items-listing', true);
      this.listenTo(view, 'item:remove', this.delItem);
    },
    addItems: function (items) {
      _.each(items, this.addItem, this);
    },
    delItem: function (item) {
      var items = this.model.get(this.name);
      
      this.model.set(this.name, _.without(items, item));
      this.model.save(this.name);
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
        view: ListingView,
        options: {
          collection: Permissions,
          name: 'Permission'
        }
      },
      'users': ListingView,
      'groups': ListingView
    },
    preRender: function () {
      this.context.item = this.model.toJSON();
    },
    render: function () {
      DetailView.__super__.render.apply(this, arguments);
      return this;
    },
    off: function () {
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
    },
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
        row_template: RowTpl 
      }), '#role-list');
      
      this.listenTo(TView, 'row:clicked', this.showDetail);
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
          row.$el.removeClass('info')
        });
        row.$el.addClass('info');

        url = [this.getViewUrl(), row.model.id].join('/');  
      } else {
        if (view) view.close();
        if (this.selected_model) this.stopListening(this.selected_model);
        this.selected_model = null;
      }
      Backbone.history.navigate(url)
    },
    showAddView: function () {
      var form = new Forms.Role({
          model: new Role()
      });
      
      var wrap = new Qorus.View();
      wrap.insertView(form, 'self');
      
      this.setView(new Modal({
        content_view: wrap
      }));
    }
  });
  
  return View;
});
