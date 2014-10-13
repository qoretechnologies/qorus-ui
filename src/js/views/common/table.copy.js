define(function (require) {
  var _         = require('underscore'),
      Qorus     = require('qorus/qorus'),
      utils     = require('utils'),
      Template  = require('tpl!templates/common/table.copy.html'),
      ModalTpl  = require('tpl!templates/common/table.copy.modal.html'),
      Modal     = require('views/common/modal'),
      View, ModalContent, TModal;

  ModalContent = Qorus.ModelView.extend({
    template: ModalTpl,
    preRender: function () {
      this.context.csv = utils.tableToCSV(this.options.csv_options);
    }
  });
  
  TModal = Modal.extend({
    postInit: function () {
      var self = this;
      _.bindAll(this, 'selectAll');
      $(document).on('focusin.modal', function (e) {
        if (e.target !== self.el) return;
        self.selectAll();
      });
    },
    selectAll: function () {
      this.$('.copy-table').focus().select();
    }
  });
  
  View = Qorus.View.extend({
    template: Template,
    csv_options: {
      el: 'table'
    },
    additionalEvents: {
      'click a': 'showModal'
    },
    postInit: function () {
      if (this.options.csv_options) this.csv_options = this.options.csv_options;
      this.context.css_class = this.options.css_class || '';
    },
    showModal: function (e) {
      var self = this;
      var ModalView = new ModalContent({ 
            csv_options: this.csv_options
          });
          
      var modal = this.setView(new TModal({ content_view: ModalView }), '#table-copy-modal');
      this.listenTo(modal, 'destroy', this.removeModal);
    },
    removeModal: function () {
      delete this.views['#table-copy-modal'];
    }
  });
  
  return View;
});