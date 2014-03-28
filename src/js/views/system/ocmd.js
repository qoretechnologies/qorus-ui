define(function (require) {
  var $        = require('jquery'),
      _        = require('underscore'),
      Backbone = require('backbone'),
      Qorus    = require('qorus/qorus'),
      Helpers  = require('qorus/helpers'),
      settings = require('settings'),
      Template = require('text!templates/system/ocmd.html'), 
      url, View;
  
  url = settings.REST_API_PREFIX + '/system/api';
  
  View = Qorus.View.extend({
    history: [],
    
    template: Template,
    additionalEvents: {
      'submit': 'doAction',
      'keypress input[type=text]': 'doAction',
      'keydown #command': 'keyDown'
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
      this.getCommands();
    },
    
    doAction: function (e) {
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
        method: cmd.split(/\s+/, 2)[0],
        parse_args: cmd.split(/\s+/, 2)[1]
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
    
    keyDown: function (e) {
      debug.log(e.keyCode);
      if (e.keyCode == 38 || e.keyCode == 40) {
        this.browseHistory(e);
      // } else if (e.keyCode == 9) {
      //   debug.log('going autocomplete');
      //   this.autocomplete(e);
      }
    }, 
    
    browseHistory: function (e) {      
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
    },
    
    autocomplete: function (e) {
      e.preventDefault();
    },
    
    getCommands: function () {
      var view = this;
      var params = {
        action: 'call',
        method: 'help'
      }
      $.put(url, params)
        .done(view.initTypeahead);
    },
    
    initTypeahead: function (data) {
      this.$('#command').typeahead({ 
        source: _.keys(data),
        dropup: true
      });
    }
    
  });
  
  return View;
});
