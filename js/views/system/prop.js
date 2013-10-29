define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'settings',
  'text!../../../templates/system/prop.html'
], function($, _, Backbone, Qorus, settings, Template){

  var ServiceView = Qorus.View.extend({
    views: {},
    defaultEvents: {
      'submit': 'doAction',
      'click a[data-action]': 'doAction',
      'click button[data-action]': 'doAction'
    },
    template: Template,

    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts || {};
      
      this.on('fetch', this.render);
      this.getData();
    },
    
    getUrl: function () {
      return [settings.REST_API_PREFIX, 'system', 'props'].join('/');
    },
    
    getData: function () {
      var self = this;
      var url = this.getUrl();
      
      $.get(url)
        .done(function (data) {
          self.data = data;
          self.context.data = data;
          // self.trigger('fetch');
        });
    },
    
    // render: function (ctx) {
    //   this.context.data = this.data;
    //   
    //   ServiceView.__super__.render.call(this, ctx);
    // },
    
    doAction: function (ev) {
      var params = {};
      var $target = $(ev.currentTarget);
      ev.preventDefault();
      
      if ($target.attr('type') == 'submit') {
        var $f = $target.parents('form');

        var vals = $f.serializeArray();
        var params = {};
      
        _.each(vals, function (v) {
          params[v.name] = v.value;
        });
        
        // close modal
        $f.parents('.modal').modal('hide');
      } else {
        var params = ev.currentTarget.dataset;
      }
      
      this.runAction($target.data('action'), params);
    },
    
    runAction: function (action, data) {
      var _this = this;
      var url = [this.getUrl(), data.domain, data.key].join('/');
      var args = _.values(data);
      
      if (action == 'update') {
        $.put(url, { action: 'set', parse_args: data.value })
          .done(function (resp) {
            _this.getData();
          })
          .fail(function (resp) {
            debug.log(resp);
          });        
      } else if (action == 'delete') {
        $.delete(url)
          .done(function (resp) {
            _this.getData();
          })
          .fail(function (resp) {
            debug.log(resp);
          });
      }
    }
  });
  
  return ServiceView;
});