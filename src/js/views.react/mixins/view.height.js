define(function (require) {
  var $       = require('jquery'),
      _       = require('underscore'),
      utils   = require('utils'),
      PADDING = 60;
  
  return {
    _setHeight: function () {
      if (this.isMounted()) {
        var height,
            $el = $(this.getDOMNode());

        if (this.props.container) {
          height = $(this.props.container).height();
        } else {
          height = $(window).innerHeight() - $el.position().top - PADDING;
        }

        $el.height(height);  
      }
    },
    
    componentDidMount: function () {
      $(this.getDOMNode())
        .addClass('box-sizing-border')
        .addClass('overflow-hidden');
      
      _.defer(this._setHeight);
      this.resize_key = 'resize.component.' + utils.guid();
      $(window).on(this.resize_key, _.debounce(this._setHeight, 500));
    },
    
    componentWillUnmount: function () {
      $(window).off(this.resize_key);
    }
  };
});