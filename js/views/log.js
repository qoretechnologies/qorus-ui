define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/logs',
  'text!../../../templates/common/log.html',
  'jquery.ui'
], function ($, _, Qorus, Dispatcher, Collection, Template) {
  var View = Qorus.View.extend({
    messages: "",
    // additionalEvents: {
    //   'click a': function (e) { console.log('Log tab', e); }
    // },
    
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this);
      
      this.template = Template;
      this.parent = opts.parent;
      
      if (_.has(opts, 'context')) {
        _.extend(this.context, opts.context);
      }
      
      // init model
      this.collection = new Collection({ 
        socket_url: opts.socket_url, 
        auto_reconnect: opts.auto_reconnect 
      });
      
      this.collection.on('message', this.appendText);
      
    },
    
    onRender: function () {
      // hack
      var lv = this;
      if (this.parent) {
        $('a[href=#log]', this.parent.$el).click(function (e) {
          _.defer(lv.scroll);
        });
      }
    },

    isScrollable: function () {
      return (this.$el.find('#log-scroll').val() == 'on');
    },
    
    appendText: function (t, text) {
      var _this = this;
      
      $('textarea.log', this.$el).val(function (i, val) {
        return val + text;
      });
      this.scroll();
    },
    
    scroll: function () {
      if (this.isScrollable()) {
        $('textarea.log', this.$el).scrollTop(function (v) {
          return this.scrollHeight;
        });        
      }
    },
    
    clean: function () {
      this.collection.wsClose();
      this.stopListening();
      this.undelegateEvents();
    }
    
  });
  
  return View;
});