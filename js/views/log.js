define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'qorus/dispatcher',
  'collections/logs',
  'text!templates/common/log.html',
  'text!templates/common/log_pre.html',
  'jquery.ui'
], function ($, _, Qorus, Dispatcher, Collection, Template, TemplatePre) {
  var View = Qorus.View.extend({
    msg_queue: [],
    is_scrollable: true,
    additionalEvents: {
      'click #log-scroll': 'toggleScroll'
    },
    messages: "",
    // additionalEvents: {
    //   'click a': function (e) { debug.log('Log tab', e); }
    // },
    
    initialize: function (opts) {
      // reset views
      this.views = {};
      this.opts = opts;
      _.bindAll(this);
      
      this.template = TemplatePre;
      this.parent = opts.parent;
      
      if (_.has(opts, 'context')) {
        _.extend(this.context, opts.context);
      }
      
      // init model
      // console.log(opts);
      this.collection = new Collection([], { 
        socket_url: opts.socket_url, 
        auto_reconnect: opts.auto_reconnect 
      });
      
      this.listenTo(this.collection, 'message', this.appendTextPre);
      this.on('show', this.onShow);
      this.on('update', _.throttle(this.update, 5000));
    },
    
    onRender: function () {
      // hack
      var lv = this;
      if (this.parent) {
        $('a[href=#log]', this.parent.$el).click(function () {
          _.defer(lv.scroll);
        });
      }
      // this.fixHeight();
    },
    
    onShow: function () {
      _.defer(this.fixHeight);
    },

    toggleScroll: function (e) {
      var $el = $(e.currentTarget);
      this.is_scrollable = $el.prop('checked');
      // console.log(this.is_scrollable);
    },

    isScrollable: function () {
      return this.is_scrollable;
    },
    
    appendTextPre: function (t, text) {
      var self = this;
      
      _(text.split('\n')).each(function (msg) {
        self.msg_queue.push(msg);
      });
      
      this.trigger('update');
    },
    
    update: function () {
      var html, log, msgs = this.msg_queue;
      
      html = document.createDocumentFragment();

      while (this.msg_queue.length > 0) {
        msg = this.msg_queue.shift();
        el = $('<pre>'+msg+'</pre>');
        html.appendChild(el.get(0));
      }

      log = $('.log-area', this.$el).get(0);

      $(html).appendTo($(log));

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
        $('.log', this.$el).scrollTop(function () {
          // debug.log(this.scrollHeight);
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
      var $parent = $(window),
        $log = this.$('.log-area');
        
        console.log(this.$('.log-area'), this.$('.log-area').offset());
      $log.height($parent.height() - $log.offset().top - 40);
      console.log($log.height(), $log.position().top, $log.offset().top);
    }
    
  });
  
  return View;
});