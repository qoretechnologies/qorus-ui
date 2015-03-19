define(function (require) {
  var React           = require('react'),
      PureRenderMixin = React.addons.PureRenderMixin,
      _               = require('underscore'),
      Checker;

  Checker = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      checked: React.PropTypes.bool,
      rowCheck: React.PropTypes.func
    },
    
    render: function () {
      var cls = React.addons.classSet({ 
        'check': true, 
        'icon-check-empty': !this.props.checked, 
        'icon-check': this.props.checked 
      });
      
      return (
        <i className={cls}></i>
      );
    }
  });
  
  return Checker;
});