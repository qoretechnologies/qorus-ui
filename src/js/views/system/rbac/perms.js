define(function (require) {
  var Backbone    = require('backbone'),
      _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      Template    = require('tpl!templates/system/rbac/perms.html'),
      TableTpl    = require('text!templates/system/rbac/perms/table.html'),
      RowTpl      = require('text!templates/system/rbac/perms/row.html'),
      PaneView    = require('views/common/pane'),
      ModalView   = require('views/common/modal'),
      ModalTpl    = require('tpl!templates/system/rbac/roles/modal.html'),
      Permissions = require('collections/permissions'),
      BaseToolbar = require('views/toolbars/toolbar'),
      ToolbarTpl  = require('tpl!templates/system/rbac/perms/toolbar.html'),
      Forms       = require('views/system/rbac/forms'),
      Permission  = require('models/permission'),
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
      "click .add-perm": 'showAddView'
    },
    url: "/perms",
    collection: new Permissions(),
    template: Template,
    preRender: function () {
      var TView = this.setView(new Qorus.TableView({
        url: "/perms",
        collection: this.collection, 
        template: TableTpl, 
        row_template: RowTpl,
        row_view: RowView
      }), '#perm-list');
      
      this.listenTo(TView, 'row:edit', this.showEditView);
      
      this.setView(new Toolbar({ template: ToolbarTpl }), '.toolbar');
    },
    showAddView: function () {
      var form = new Forms.Permission({
          model: new Permission(),
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
      var form = new Forms.Permission({
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
