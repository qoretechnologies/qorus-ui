define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      Backbone = require('backbone'),
      Qorus    = require('qorus/qorus'),
      utils    = require('utils'),
      Template = require('text!templates/extensions/extension.html'),
      Extension, View;
    
  Extension = function () {
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
      query = query || this.query;
      query = query.replace(/^\?/, "");
      
      var url = this.baseUrl + '?' + query;
      var _this = this;
      
      debug.log("fetching ->" , url);
      
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

  View = Qorus.View.extend({
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
      return this;
    },
    
    onRender: function () {
      $('#extension-home', this.$el).html(this.extension.renderTpl());
    },
    
    catchClick: function (e) {
      var $target = $(e.currentTarget);
      
      if ($target.attr('href').startsWith('data')) {
        return true;
      }
      
      if ($target.attr('target')) {
        window.open($target.attr('href'), $target.attr('target'));
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      if ($target.data('toggle') != 'dropdown') {
        e.stopPropagation();
        e.preventDefault();
      }

      if (($target.data('toggle') != 'dropdown' && !$target.data('action'))) {
        this.extension.fetch($target.attr('href'));

        var url = utils.getCurrentLocationPath() + $target.attr('href');
        Backbone.history.navigate(url, { trigger: false });
      }
    }
  });

  // return function (extension, path) { debug.log(extension) };
  return View;
});
