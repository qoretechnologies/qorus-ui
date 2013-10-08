define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/logs',
  'text!../../templates/common/log.html',
  'text!../../templates/common/log_pre.html',
  'jquery.ui'
], function ($, _, Qorus, Dispatcher, Collection, Template, TemplatePre) {
  var View = Qorus.View.extend({
    messages: "",
    // additionalEvents: {
    //   'click a': function (e) { console.log('Log tab', e); }
    // },
    
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this);
      
      this.template = TemplatePre;
      this.parent = opts.parent;
      
      if (_.has(opts, 'context')) {
        _.extend(this.context, opts.context);
      }
      
      // init model
      this.collection = new Collection({ 
        socket_url: opts.socket_url, 
        auto_reconnect: opts.auto_reconnect 
      });
      
      this.listenTo(this.collection, 'message', this.appendTextPre);
      
    },
    
    onRender: function () {
      // hack
      var lv = this;
      if (this.parent) {
        $('a[href=#log]', this.parent.$el).click(function (e) {
          _.defer(lv.scroll);
        });
      }
      this.fixHeight();
    },

    isScrollable: function () {
      return (this.$el.find('#log-scroll').val() == 'on');
    },
    
    appendText: function (t, text) {
      var lines_text = text.split('\n').length;
      var lines = this.messages.split('\n').length;
      
      if (lines + lines_text > this.collection.log_size) {
        this.messages = this.messages.slice(-lines_text);
      }
      
      this.messages += text;
      
      $('textarea.log', this.$el).val(this.messages);
      this.scroll();
    },
    
    appendTextPre: function (t, text) {
      var html = $('<pre />').text(text);
      var $el = this.$el;
      
      setTimeout(function () {
        $('.log-area', $el).append(html);
      }, 100);
      
      var log = $('.log-area', this.$el).get(0);

      if (log) {
        while (log.childNodes.length > this.collection.log_size) {
          log.removeChild(log.firstChild);
          this.scroll();
        }
      }
      
      this.scroll();
    },
    
    scroll: function () {
      if (this.isScrollable()) {
        $('.log', this.$el).scrollTop(function (v) {
          // console.log(this.scrollHeight);
          return this.scrollHeight;
        });        
      }
    },
    
    clean: function () {
      this.collection.wsClose();
      this.stopListening();
      this.undelegateEvents();
    },
    
    fixHeight: function () {
      // maintain the height of log area
      var $parent = this.$el.parents('.content');
      var $log = this.$('.log-area');
      $log.height($parent.height() - $log.position().top);
    }
    
  });
  
  return View;
});