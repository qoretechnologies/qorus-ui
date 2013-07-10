define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'qorus/helpers',
  'settings',
  'text!../../../templates/system/ocmd.html'
], function($, _, Backbone, Qorus, Helpers, settings, Template){
  var url = settings.REST_API_PREFIX + '/system/api';

  var View = Qorus.View.extend({
    history: [],
    
    template: Template,
    additionalEvents: {
      'submit': 'doAction',
      'keypress input[type=text]': 'doAction',
      'keydown #command': 'browseHistory'
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.template = Template;
      this.render();
      $(window).bind("resize.app", _.bind(this.setHeight, this));
    },
    
    onRender: function () {
      $('#command', this.$el).focus();
      this.setHeight();
    },
    
    doAction: function (e) {
      console.log('really?', e.keyCode);
      if (e.keyCode == 13) {
        this.execute(e);
      }
    },
    
    addResponse: function (resp) {
      if (_.isObject(resp)) {
        resp = Helpers.createNestedList(resp);
      }
      $('#output', this.$el).append("&gt;&gt;&gt " +resp + "<br />");
      
      $('#output').scrollTop($('#output')[0].scrollHeight);
    },
    
    setHeight: function () {
      var h = $(window).height();
      $('#output', this.$el).height(h-100);
    },
    
    remove: function() {
        // unbind the namespaced event (to prevent accidentally unbinding some
        // other resize events from other code in your app
        // in jQuery 1.7+ use .off(...)
        $(window).unbind("resize.app");
        // don't forget to call the original remove() function
        Backbone.View.prototype.remove.call(this);
    },
    
    execute: function () {
      var _this = this;
      var cmd = $('#command').val();
      var params = { 
        action: "call",
        method: cmd.split(/\s+/, 1)[0],
        parse_arg: cmd.split(/\s+/, 1)[1]
      };
    
      $('#command').val('');
      this.addToHistory(cmd);
      this.addResponse(params.method);
    
      $.put(url, params)
        .done(function (data) {
          _this.addResponse(data);
        })
        .fail(function (data) {
          var resp = JSON.parse(data.responseText);
          _this.addResponse("<span class=\"error\">" + resp.desc + "</span>");
        });
    },
    
    addToHistory: function (val) {
      this.history.push(val);
      this.historyTarget = this.history.length - 1;
    },
    
    browseHistory: function (e) {
      console.log(e.keyCode, this.historyTarget, this.history[this.historyTarget]);
      
      if (e.keyCode == 40) {
        if (this.historyTarget < this.history.length - 1) {
          this.historyTarget += 1;
          $('#command').val(this.history[this.historyTarget]);          
        } else {
          $('#command').val('');
        }
      } else if (e.keyCode == 38) {
        $('#command').val(this.history[this.historyTarget]);
        this.historyTarget -= (this.historyTarget > 0) ? 1 : 0;
      }
      e.stopPropagation();
    }
    
  });
  
  return View;
});