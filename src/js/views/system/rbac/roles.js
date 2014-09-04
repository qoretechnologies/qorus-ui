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
      AddItemTpl     = require('tpl!templates/common/item_add.html'),
      Forms          = require('views/system/rbac/forms'),
      Fields         = require('qorus/fields'),
      Users          = require('collections/users'),
      Groups         = require('collections/groups'),
      View, DetailView, Modal, ListingView, RowView, ItemView, AddItemView;

  
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
  
  ItemView = Qorus.View.extend({
    tagName: 'li',
    className: 'label label-info',
    additionalEvents: {
      'click .remove': 'removeItem'
    },
    template: ItemTpl,
    removeItem: function () {
      this.trigger('item:remove', this.options.item);
      this.off();
    }
  });
  
  AddItemView = Qorus.View.extend({
    additionalEvents: {
      'click .add': 'addItem'
    },
    template: AddItemTpl,
    preRender: function () {
      var view = new Fields.SelectView({
        name: 'Add item',
        attrName: this.options.name,
        collection: this.collection
      });
      this.insertView(view, '.listing');
    },
    addItem: function (e) {
      e.preventDefault();
      var view = this.getView('.listing')[0];
      
      var items = this.model.get(this.options.name);
      items.push(view.getElValue());
      this.model.set(this.options.name, items);
      this.model.save();
      this.model.trigger('item:'+this.options.name+':add', view.getElValue());
      this.off();
    }
  });
  
  // Role detail attribute listing
  ListingView = Qorus.View.extend({
    additionalEvents: {
      'click .add-item': 'addItemView',
    },
    template: ListingViewTpl,
    postInit: function () {
      var name = this.options.name.toLowerCase();
      this.listenTo(this.model, 'item:'+name+':add', this.addItem);
    },
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
      this.$('.items-listing').empty();
      _.each(items, this.addItem, this);
    },
    delItem: function (item) {
      var items = this.model.get(this.name);
      
      this.model.set(this.name, _.without(items, item));
      this.model.save(this.name);
    },
    addItemView: function () {
      var listed     = this.model.get(this.name),
          collection = this.collection.reject(function (item) { 
            return listed.indexOf(item.get('name')) > -1; 
            }),
          $btn       = this.$('.add-item');

      $btn.hide();
      var view = this.insertView(new AddItemView({ 
        name: this.name,
        model: this.model,
        collection: collection
      }), '.add-item-form', true);

      this.listenToOnce(view, 'destroy', $.proxy(function () { this.show(); }, $btn));
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
          collection: new Permissions().fetch(),
          name: 'Permissions'
        }
      },
      'users': {
        view: ListingView,
        options: {
          collection: new Users().fetch(),
          name: 'Users',
          readonly: true
        },
      },
      'groups': {
        view: ListingView,
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
        if (view) view.close();
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
    }
  });
  
  return View;
});
