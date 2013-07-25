define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'utils',
  'settings',
  'text!../../../templates/extensions/extension.html'
], function($, _, Backbone, Qorus, utils, settings, Template){
    
  var Extension = function (extension, path) {
    this.initialize.apply(this, arguments);
  };
    
  _.extend(Extension.prototype, Backbone.Events, {
    initialize: function (extension, query) {
      this.url = '/' + ['UIExtension', extension].join('/');
      this.url += '?' + query; 
    },
    
    get: function (key) {
      return this.data[key];
    },
    
    fetch: function () {
      var url = this.url;
      var _this = this;
      
      console.log("fetching ->" , url);
      
      $.get(url)
        .done(function (resp) {
          _this.template = resp;
          _this.trigger('fetch');
          _this.trigger('sync');
        });
    },
    
    renderTpl: function (tpl) {
      tpl = tpl || 'main';
      var tmpl = _.template(this.template);
      return tmpl;
    }
  });

  var View = Qorus.View.extend({
    title: "Extension",
    context: {},
    
    initialize: function (options, extension, path) {
      this.template = Template;
      
      this.extension = new Extension(extension);
      this.extension.fetch();
      
      // this.createSubviews();
      this.listenToOnce(this.extension, 'fetch', this.render);
    },
    
    render: function (ctx) {
      var context = _.extend(this.context, { item: this.extension }, ctx);
      
      View.__super__.render.call(this, context);
    },
    
    onRender: function () {
      $('#extension-home', this.$el).html(this.extension.renderTpl());
    }
  });

  // return function (extension, path) { console.log(extension) };
  return View;
});