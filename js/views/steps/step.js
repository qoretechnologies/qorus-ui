define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/step',
  'views/common/modal',
  'text!templates/steps/modal.html',
  'jquery.ui',
  'rainbow.qore'
], function ($, _, Qorus, Model, Modal, Template) {
  var ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle',
    },
    
    initialize: function (opts) {
      console.log('hello stepview');
      this.views = {};
      this.opts = opts;
      _.bindAll(this, 'render');
      
      this.template = Template;
      
      // init model
      this.model = new Model({ id: opts.id });
      this.listenTo(this.model, 'change', this.render);      
      this.model.fetch();
      
      this.on('render', function () { Rainbow.color() });
    },
    
    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');
    },
    
    off: function () {
      this.undelegateEvents();
      this.stopListening();
      this.$el.empty();
    }
  });
  
  var ModalView = Modal.extend({
    initialize: function (opts) {
      this.views = {};
      ModalView.__super__.initialize.call(this, opts);
      this.setView(new ModelView(this.opts), '.content', true);
    }
  });
  
  return ModalView;
});