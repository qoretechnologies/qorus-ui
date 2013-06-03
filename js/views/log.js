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

    appendText: function (t, text) {
      // this.messages += text;
      console.log(t, text);
      $('textarea.log', this.$el).val(function (i, val) {
        return val + text + "\n";
      });
      // console.log(this.messages);
    },
    
    clean: function () {
      console.log("Cleaning log", this.collection);
      this.collection.wsClose();
      this.stopListening();
      this.undelegateEvents();
    }
    
  });
  
  return View;
});