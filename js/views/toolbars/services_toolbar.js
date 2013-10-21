define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'text!../../../templates/service/toolbars/service_toolbar.html',
  'datepicker',
  'moment',
  'bootstrap.multiselect'
], function($, _, Backbone, Qorus, Template, date, moment){
  var Toolbar = Qorus.View.extend({
    context: {},
    
    events: {
      // "click button.date": "setDate",
      // "click button[data-action='open']": "navigateTo"
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      Toolbar.__super__.initialize.call(this, opts);
      
      this.context.date = this.options.date;
      this.template = Template;
    },
    
    onRender: function () {
      $('.sticky')
        .affix()
        .width(function () { return $(this).parent().width(); });
    },
    
    clean: function () {
      this.$('.sticky').sticky('remove');
    },
    
    navigateTo: function (e) {
      var el = $(e.currentTarget);
      if (el.data('url')) {
        Backbone.history.navigate(el.data('url'), {trigger: true});       
      }
    }
  });
  return Toolbar;
});
