define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/step',
  'views/common/modal',
  'text!../../../templates/steps/modal.html',
  'jquery.ui',
  'rainbow.qore'
], function ($, _, Qorus, Model, Modal, Template) {
  var ModelView = Qorus.View.extend({
    additionalEvents: {
      "click .nav-tabs a": 'tabToggle',
    },
    
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this, 'render');
      
      this.template = Template;
      
      // init model
      this.model = new Model({ id: opts.id });
      this.model.fetch();
      this.model.on('change', this.render);
      
      this.on('render', function () { Rainbow.color() });
    },
    
    render: function (ctx) {
      ModelView.__super__.render.call(this, ctx);
    },
    
    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');
    }
  });
  
  var ModalView = Modal.extend({
    initialize: function (opts) {
      ModalView.__super__.initialize.call(this, opts);
      this.subviews.content = new ModelView(this.opts);
    }
  });
  
  return ModalView;
});