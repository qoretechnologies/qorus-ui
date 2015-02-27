define(function (require) {
  var Reflux    = require('reflux'),
      $         = require('jquery'),
      _         = require('underscore'),
      settings  = require('settings');
  
  var WebsocketMixin = {
    init: function () {
      this.retries = 0;
      this.max_retries = 5;
      this.socket = {};
    },
    
    _connect: function () {
      $.get(settings.REST_API_PREFIX + '/system?action=wstoken')
        .done(function (response) {
          this.token = response;
          this._open();
        }.bind(this))
        .fail(function () {
          this._retry();
        }.bind(this));
    },
    
    _open: function () {
      if (this._url) {
        var url = this._url + '?token=' + this.token;
        try {
          this.socket = new WebSocket(url); 
          this.socket.onmessage = this.onMessage;
          this.socket.onclose = this._retry;
          this.socket.onopen = this._opened;
          this.socket.onerror = this._error;
        } catch (e) {
          this.onMessage({ data: e });
        }
      } else {
        this.onMessage('Websocket URL not defined');
      }
    },
    
    _retry: function () {
      if (this.retries >= this.max_retries) {
        return;
      }
      
      if (this.auto_reconnect) {
        setTimeout(this._connect, 5000); 
      }
      this.retries++;
    },
    
    _opened: function () {
      this.state.rows = [];
      this.trigger(this.state);
    },
    
    _error: function () {},
    
    _close: function () {
      if (this.socket instanceof WebSocket && this.socket.readyState != 3) {
        this.socket.onclose = function (e) { debug.log('Closed', e); };
        this.socket.close(); 
      }
    },
    
    onConnect: function (url) {
      this._url = url;
      this._connect();
    },
    
    onMessage: function (msg) {
      var rows = JSON.parse(msg.data);
      _.each(rows, function (row) {
        this.state.rows.push(row);
      }, this);
      
      this.trigger(this.state);
    },
    
    onClose: function () {
      this._close();
    }
  };
  
  return function LogStore(actions) {
    return Reflux.createStore({
      mixins: [WebsocketMixin],
      listenables: [actions],
      
      init: function () {
        var state = this.state || {};
        this.state = _.extend(state, {
          rows: [],
          max_rows: 1000,
          scroll: true,
          pause: false
        });
      },
      
      onMessage: function (msg) {
        var rows = msg.data.split('\n');
        var max = this.state.max_rows;
  
        this.state.rows = this.state.rows.concat(rows).slice(Math.max(0, this.state.rows.length - max), max);
        
        if (!this.state.pause) {
          this.publish();  
        }
      },
      
      publish: _.debounce(function () {
        this.trigger(this.state);
      }, 1000, { leading: true, maxWait: 1500, trailing: true }),
      
      onToggleScroll: function () {
        this.state.scroll = !this.state.scroll;
        this.trigger(this.state);
      },
      
      onTogglePause: function () {
        this.state.pause = !this.state.pause;
        if (this.state.pause) {
          this.state.rows.push('--- Paused ---');
        } else {
          this.state.rows.push('--- Continue ---');
        }
        
        this.trigger(this.state);
      }
    });
  };
});
