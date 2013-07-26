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
      this.baseUrl = '/' + ['UIExtension', extension].join('/');
      this.query = query; 
    },
    
    get: function (key) {
      return this.data[key];
    },
    
    fetch: function (query) {
      var query = query || this.query;
      query = query.replace(/^\?/, "");
      
      var url = this.baseUrl + '?' + query;
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
    additionalEvents: {
      "click a": "catchClick"
    },
    
    initialize: function (options, extension, query) {
      this.template = Template;
      
      this.extension = new Extension(extension, query);
      this.extension.fetch();
      
      // this.createSubviews();
      this.listenTo(this.extension, 'fetch', this.render);
    },
    
    render: function (ctx) {
      var context = _.extend(this.context, { item: this.extension }, ctx);
      
      View.__super__.render.call(this, context);
    },
    
    onRender: function () {
      $('#extension-home', this.$el).html(this.extension.renderTpl());
    },
    
    catchClick: function (e) {
      e.stopPropagation();
      e.preventDefault();
      $target = $(e.currentTarget);
      this.extension.fetch($target.attr('href'));
      
      var url = utils.getCurrentLocationPath() + $target.attr('href');
      Backbone.history.navigate(url, { trigger: false });
    }
  });

  // return function (extension, path) { console.log(extension) };
  return View;
});