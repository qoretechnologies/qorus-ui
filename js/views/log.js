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
    
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this);
      
      this.template = Template;
      
      if (_.has(opts, 'context')) {
        _.extend(this.context, opts.context);
      }
      
      // init model
      this.collection = new Collection({ socket_url: opts.socket_url });
      this.collection.on('message', this.appendText);
    },
    
    onRender: function () {
      this.scroll();
    },

    appendText: function (t, text) {
      $('textarea.log', this.$el).val(function (i, val) {
        return val + text;
      });
      this.scroll();
    },
    
    scroll: function () {
      $('textarea.log', this.$el).scrollTop(function (v) {
        console.log(this.scrollHeight - this.scrollTop === this.clientHeight || this.scrollTop == 0, this.scrollHeight, 
          this.scrollTop, this.clientHeight);
        // if (this.scrollHeight - this.scrollTop === this.clientHeight || this.scrollTop == 0) {
          return this.scrollHeight;
        // }
      });
    },
    
    clean: function () {
      this.collection.wsClose();
      this.stopListening();
      this.undelegateEvents();
    }
    
  });
  
  return View;
});