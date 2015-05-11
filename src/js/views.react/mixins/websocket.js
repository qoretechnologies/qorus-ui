define(function (require) {
  var React = require('react'),
      _     = require('underscore');
    
  var WebSocketMixin = {
    maxRetries: 5,
    numRetries: 0,
    componentWillMount: function () {
      this.wsOpen();
    },
    
    componentWillUnmount: function () {
      this.socket.close();
      $(window).off('resize.graphing');
    },
    
    wsOpen: function (e) {
      var url = _.result(this, 'websocketUrl');
      
      if (url) {
        try {
          this.socket = new WebSocket(url);
          this.socket.onmessage = this.wsOnMessage;
          this.socket.onerror = this.onError || this.wsOnError;
          this.socket.onclose = this.onClose || this.wsOnClose;
          this.socket.onopen = this.onOpen || this.wsOnOpen;
          this.numRetries = 0;
        } catch (err) {
          this.wsOnError(err);
        }
      }
    },
    
    wsOnOpen: function () {
      this.numRetries = 0;
      this.onMessage({ data: '{}' });
    },
    
    wsOnError: function (e) {
      console.warn('WebSocket error', e);
    },
    
    wsOnClose: function (e) {
      console.warn('Websocket close', e);
    },
    
    wsRetry: function () {
      if (this.numRetries <= this.maxRetries) {
        _.delay(this.wsOpen, 5000);
        this.numRetries++;
      }
    },
    
    wsOnMessage: function (msg) {
      var data = JSON.parse(msg.data);
      this.onMessage.call(this, data);
    }
  };
  
  return WebSocketMixin;
});